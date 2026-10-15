export const checkValidData = (email, password) => {
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email,
  );

  const isPasswordValid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{6,72}$/.test(
    password,
  );

  if (!isEmailValid) {
    return "Email is not valid";
  }

  if (!isPasswordValid) {
    return "Password must be 6 to 72 characters with an uppercase letter, a lowercase letter, and a number, and no spaces.";
  }

  return null;
};
