import jwt from 'jsonwebtoken';
export const protectRoute = async (req, res, next) => {
   try {
      const {accessToken} = req.cookies;
      if (!accessToken) {
        return res.status(401).json({message : 'Unauthorized - No acess token provided'})
      }
      try {
        const {userId} = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = User.findById(userId).select('-password')
      } catch (error) {
        
      }

   } catch (error) {
    
   }
}

export const adminRoute = async (req, res, next) => {

}