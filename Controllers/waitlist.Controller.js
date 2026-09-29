import WaitlistModel from "../Model/Waitlist.js";

const waitlistController = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
      // Check if user already exists by email address
      const userExists = await WaitlistModel.findOne({ email });
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      // Create a new user
      const newUser = await WaitlistModel.create({
        email,
      });
      res.status(201).json({
        success: true,
        message: "Email added to waitlist successfully",
      });
    } catch (error) {
      console.error("Waitlist error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during waitlist",
      });
    }
  };
  
  export default waitlistController;
  
  