export type IFormData = {
  email: string;
  password: string;
};

export type IPasswordChangeData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
