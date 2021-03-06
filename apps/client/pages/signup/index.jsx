import Head from "next/head";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useEffect } from "react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const [postSignUpResponse, setPostSignUpResponse] = useState(null);

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("member")) {
      window.location.href = window.location.origin + "/profile";
    }
  }, []);

  // useEffect(() => {
  //   setIsNameValid(validateName(name));
  //   setIsEmailValid(validateEmail(email));
  //   setIsPasswordValid(validatePassword(password));
  //   setIsPasswordConfirmValid(
  //     validatePasswordConfirm(password, passwordConfirm)
  //   );
  // }, [name, email, password, passwordConfirm]);

  useEffect(() => {
    setCanSubmit(
      isNameValid && isEmailValid && isPasswordValid && isPasswordConfirmValid
    );
  }, [isNameValid, isEmailValid, isPasswordValid, isPasswordConfirmValid]);

  useEffect(() => {
    if (postSignUpResponse) setIsSnackBarOpen(true);
  }, [postSignUpResponse]);

  const validateName = name => name.length > 0;

  const validateEmail = email =>
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      email
    );

  const validatePassword = password => password.length >= 8;

  const validatePasswordConfirm = (password, passwordConfirm) =>
    password === passwordConfirm;

  const submit = async payload => {
    return await fetch(process.env.NEXT_PUBLIC_API_BASEURL + "/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .catch(err => err);
  };

  return (
    <>
      <Head>
        <title>Buat akun | Presisi</title>
        <meta
          name="description"
          content="Rekomendasi cara belajar berdasarkan model VARK"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-8 h-screen">
        <div className="container h-full mx-auto px-6 flex flex-col gap-4">
          {/* icon back */}
          <IconButton href="/" sx={{ alignSelf: "flex-start" }}>
            <ArrowBack />
          </IconButton>

          {/* form buat input nama, email, dan password */}
          <div className="flex flex-col gap-4 grow self-center justify-center max-w-xs">
            <div className="text-2xl font-bold">Buat akun</div>
            <form
              action={process.env.NEXT_PUBLIC_API_BASEURL + "/signup"}
              method="POST"
              className="flex flex-col gap-4"
            >
              <TextField
                required
                name="name"
                size="small"
                id="name"
                type="text"
                label="Nama"
                color="secondary"
                error={!isNameValid}
                helperText={!isNameValid ? "Nama tidak boleh kosong" : ""}
                onChange={e => {
                  setName(e.target.value);
                  setIsNameValid(validateName(name));
                }}
              />
              <TextField
                required
                name="email"
                size="small"
                id="email"
                type="email"
                label="Email"
                color="secondary"
                error={!isEmailValid}
                helperText={!isEmailValid ? "Email tidak valid" : ""}
                onChange={e => {
                  setEmail(e.target.value);
                  setIsEmailValid(validateEmail(email));
                }}
              />
              <TextField
                required
                name="password"
                size="small"
                id="password"
                label="Password"
                type="password"
                color="secondary"
                error={!isPasswordValid}
                helperText={
                  !isPasswordValid ? "Password minimal 8 karakter" : ""
                }
                onChange={e => {
                  setPassword(e.target.value);
                  setIsPasswordValid(validatePassword(e.target.value));
                  setIsPasswordConfirmValid(
                    validatePasswordConfirm(e.target.value, passwordConfirm)
                  );
                }}
              />
              <TextField
                required
                name="passwordConfirm"
                size="small"
                id="passwordConfirm"
                label="Ketik ulang password"
                type="password"
                color="secondary"
                error={!isPasswordConfirmValid}
                helperText={
                  !isPasswordConfirmValid ? "Password tidak sama" : ""
                }
                onChange={e => {
                  setPasswordConfirm(e.target.value);
                  setIsPasswordConfirmValid(
                    validatePasswordConfirm(password, e.target.value)
                  );
                }}
              />
              {/* button daftar */}
              <Button
                type="submit"
                variant="contained"
                onClick={async e => {
                  e.preventDefault();
                  setCanSubmit(false);
                  await submit({ name, email, password, passwordConfirm })
                    .then(res => {
                      setPostSignUpResponse(res);
                      if (res.type === "success") {
                        window.location.href =
                          window.location.origin + "/signin";
                      }
                    })
                    .catch(err => console.error(err));
                  setCanSubmit(true);
                }}
                disabled={!canSubmit}
              >
                Daftar
              </Button>
            </form>

            <Snackbar
              open={isSnackBarOpen}
              autoHideDuration={3000}
              onClose={() => {
                setIsSnackBarOpen(false);
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                severity={postSignUpResponse?.type ?? "error"}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {postSignUpResponse?.message}
              </Alert>
            </Snackbar>

            <p className="text-xs self-center">
              Sudah punya akun?.{" "}
              <a href="/signin" className="text-secondary">
                Masuk di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
