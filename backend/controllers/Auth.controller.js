import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { redis } from '../lib/redis';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
  const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

  return {accessToken, refreshToken}
}

const storeRefreshToken = async ( userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60)
}

const setCookies = (res, accesssToken, refreshToken) => {
   res.cookie('accessToken', accesssToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15*60*100
   });

   res.cookie('resfreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
   })
}

export const signup = async (req, res) => {
   const {email, name, password } = req.body;
   try {
     const userExists = await User.findOne({email});
     if(userExists) return res.status(400).json({messsage: "User alread exits"});

     const user = await User.create({name, email, password});

    //  authenticate
    const {accessToken, refreshToken} = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })
   } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({message: error.message})
   }
}

export const login = async (req, res) => {
   try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    if (user && (await user.comparePassword(password))) {
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } else {
        res.status(400).json({ message: "Invalid email or password" });
    }
   } catch (error) {
       console.log("Error in login controller", error.message);
	   res.status(500).json({ message: error.message });
   }
}

export const logout = async (req, res) => {
   try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decoded.userId}`);
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({message: 'Logged out Sucessfully'});
   } catch (error) {
      console.log("Error in logout controller", error.message);
	  res.status(500).json({ message: "Server error", error: error.message });
   }
}


// this will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({message: 'No refresh token provided'});
        }
        const {userId} = jwt.verify()
    } catch (error) {
        
    }
}

export const getProfile = async (req, res) => {
  try{
    res.json(req.user);
  }catch(error) {
    res.status(500).json({message: "Server error", error: error.message})
  }
}