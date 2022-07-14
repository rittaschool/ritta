import { useState } from "react";
import { startLogin, submitChallenge } from "../data/authentication";
import { Challenge, IUser } from "@rittaschool/shared";
import { startFido2Setup, respondToFido2Setup } from "../data/fido2";

interface UseAuthentication {
  authenticated: boolean;
  loading: boolean;
  user: IUser | null;
  challenge: Challenge | null;
  logOut: () => Promise<void>;
  startLoginProcess: (identifier?: string | null) => Promise<{
    nextScreen: string;
    errors?: readonly unknown[];
    user: {
      photoUri: string;
      firstName: string;
    } | null;
  }>;
  submitPassword: (password: string, challenge: Challenge) => any; //TODO: make interface later
  fido2: {
    startSetup: (email: string) => Promise<any>;
    finishSetup: (data: any) => Promise<boolean>;
  };
}

const screens: {
  [key: string]: string;
} = {
  EMAIL_NEEDED: "email",
  PASSWORD_NEEDED: "password",
  FIDO2_NEEDED: "fido",
  OTP_NEEDED: "otp",
};

const useAuthentication = (): UseAuthentication => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const startLoginProcess = async (
    identifier?: string | null
  ): Promise<{
    nextScreen: string;
    errors?: readonly unknown[];
    user: {
      photoUri: string;
      firstName: string;
    } | null;
  }> => {
    if (!identifier) console.log("No identifier");

    const { loading, errors, data } = await startLogin(identifier!);

    setLoading(loading);

    if (errors || !data) {
      return {
        nextScreen: screens["EMAIL_NEEDED"],
        errors: errors,
        user: null,
      };
    }

    if (!data!.challenge) throw new Error("No challenge");

    setChallenge(data!.challenge);

    if (!data!.user)
      return {
        nextScreen: screens[data!.challenge!.type],
        user: null,
      };

    return { nextScreen: screens[data!.challenge!.type], user: data!.user };
  };

  const submitPassword = async (password: string, challenge: Challenge) => {
    if (!challenge.userId) return console.log("Challenge has no userId");

    console.log("chal", challenge);

    const { errors, loading, data } = await submitChallenge({
      ...challenge,
      data: {
        passwordData: {
          password,
        },
      },
    });

    console.log("data", data);

    setLoading(loading);

    if (errors || !data) {
      console.log(errors);
    }

    if (data?.user) {
      setUser(data.user);
      return setAuthenticated(true);
    }
  };

  const fido2 = {
    // Email should be removed because this is going to be behind login
    startSetup: async (email: string) => {
      const { errors, data } = await startFido2Setup(email);

      if (errors || !data) {
        console.log(errors);
      }

      const result = await navigator.credentials
        .create({ publicKey: data })
        .catch((err) => console.log("FAIL err: ", err));

      return result;
    },
    finishSetup: async (data: any) => {
      console.log("data", data);
      const { errors, data: resultData } = await respondToFido2Setup(data);

      if (errors || !resultData) {
        console.log(errors);
        return false;
      }

      console.log(resultData);

      return true;
    },
  };

  const logOut = async () => {
    setChallenge(null);
    setUser(null);
    setLoading(false);
    setAuthenticated(false);
    // TODO: Terminate refresh token/session?
  };

  return {
    authenticated,
    loading,
    user,
    startLoginProcess,
    submitPassword,
    challenge,
    fido2,
    logOut,
  };
};

export default useAuthentication;
