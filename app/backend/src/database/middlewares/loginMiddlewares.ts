import { NextFunction, Request, Response } from 'express';

const emailValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (email === undefined || email === '') {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  next();
};

const passwordValidator = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (password.length < 6) {
    return res.status(400)
      .json({ message: 'Incorrect email or password' });
  }
  next();
};

export default [
  emailValidator,
  passwordValidator,
];
