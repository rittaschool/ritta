import { useEffect, useRef, useState } from "react";
import { AuthenticationScreen, Button, Form } from "../components";
import useAuthentication from "../hooks/useAuthentication";

const Login = () => {
  const {
    startLoginProcess,
    submitPassword,
    user,
    authenticated,
    challenge,
    fido2,
  } = useAuthentication();
  const [currentScreen, setCurrentScreen] = useState("identifier");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentScreen === "identifier") {
      const email: string = (emailRef.current as any).value;

      const result = await startLoginProcess(email);

      setCurrentScreen(result.nextScreen);
    } else if (currentScreen === "password") {
      const password: string = (passwordRef.current as any).value;

      console.log("pass", password);

      if (!challenge) return console.log("No challenge");

      const result = await submitPassword(password, challenge);
      console.log(result);
    }
  };

  const Webauthn = async () => {
    const result = await fido2.startSetup("me@midka.dev");

    if (result == null) return;

    const result2 = await fido2.finishSetup(result!);

    console.log(result2);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <div className="max-w-fit">
        {/* <Card
          isImageAtTop
          imageSrc="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        > */}
        <Button text="WebAuthN" onClick={() => Webauthn()} />
        <Form onSubmit={handleSubmit}>
          <div className="h-full min-w-[360px] px-12 pb-12 flex flex-col">
            {currentScreen === "identifier" && (
              <AuthenticationScreen title="Kirjaudu Sisään">
                <input
                  ref={emailRef}
                  type="email"
                  className="rounded text-primary mb-4 mt-8 w-full max-w-md border-light"
                  name="identifier"
                  placeholder="Käyttäjänimi"
                />
                <Button
                  text="Seuraava"
                  className="rounded bg-blue-500 p-2 w-full max-w-md text-light"
                />
              </AuthenticationScreen>
            )}
            {currentScreen === "password" && (
              <AuthenticationScreen title="Syötä Salasana">
                <input
                  ref={passwordRef}
                  type="password"
                  className="rounded text-primary mb-4 mt-8 w-full max-w-md border-light"
                  name="password"
                  placeholder="Salasana"
                />
                <Button
                  text="Seuraava"
                  className="rounded bg-blue-500 p-2 w-full max-w-md text-light"
                />
              </AuthenticationScreen>
            )}
          </div>
        </Form>
        {/* </Card> */}
      </div>
    </div>
  );
};

export default Login;
