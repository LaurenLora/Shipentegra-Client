import type { RegisterForm } from "../types";

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const isFormValid = (registerForm: RegisterForm, err: any) => {
  const { email, password, confirmPassword } = registerForm;
  let isValid = true;

  const validEmail = validateEmail(email);

  if (!email) {
    err.value.email = "Lütfen bir e-posta adresi girin.";
    isValid = false;
  }

  if (!validEmail) {
    err.value.email = "Geçersiz e-posta adresi.";
    isValid = false;
  }

  if (!password) {
    err.value.password = "Şifreyi girin.";
    isValid = false;
  }
  if (password !== confirmPassword) {
    err.value.rePassword = "Şifreler uyuşmuyor. Lütfen şifreyi kontrol edin.";
    isValid = false;
  }
  if (password.length < 6) {
    err.value.password = "Şifre en az 6 karakter olmalıdır.";
    isValid = false;
  }
  if (!confirmPassword) {
    err.value.rePassword = "Lütfen şifreyi doğrulayın.";
    isValid = false;
  }

  return isValid;
};

export const acceptedType = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp"
];
export const acceptedSize = 2 * 1024 * 1024;
