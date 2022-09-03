import { Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import Form from "../../Form";
import ThemeToggle from "../../ThemeToggle";
import EmailStep, { EmailStepValues } from "./EmailStep";
import FidoStep from "./FidoStep";
import OtpStep from "./OtpStep";
import PasswordStep, { PasswordStepValues } from "./PasswordStep";
import Success from "./Success";

type LoginSteps = "email" | "password" | "fido" | "otp" | "success";

type Props = {};

function LoginForm({}: Props) {
  const [currentStep, setCurrentStep] = useState<LoginSteps>("email");
  const [error, setError] = useState<string>();
  const [user, setUser] = useState(null);
  //const { startLoginProcess } = useAuthentication();

  const formsList = [
    useForm<EmailStepValues>({
      initialValues: {
        email: "",
      },
    }),
    useForm<PasswordStepValues>({
      initialValues: {
        password: "",
      },
    }),
    useForm<PasswordStepValues>({
      initialValues: {
        password: "",
      },
    }),
    useForm<PasswordStepValues>({
      initialValues: {
        password: "",
      },
    }),
    useForm<PasswordStepValues>({
      initialValues: {
        password: "",
      },
    }),
  ];

  const forms = {
    email: formsList[0] as UseFormReturnType<EmailStepValues>,
    password: formsList[1] as UseFormReturnType<PasswordStepValues>,
    fido: formsList[2] as UseFormReturnType<PasswordStepValues>,
    otp: formsList[3] as UseFormReturnType<PasswordStepValues>,
    success: formsList[4] as UseFormReturnType<PasswordStepValues>,
  };

  const steps = {
    email: <EmailStep form={forms.email} error={error} key="0" />,
    password: <PasswordStep form={forms.password} user={user} key="1" />,
    fido: <FidoStep key="2" />,
    otp: <OtpStep key="3" />,
    success: <Success />,
  };

  const handleSubmit = async (values: EmailStepValues | PasswordStepValues) => {
    switch (currentStep) {
      case "email":
        const { email } = values as EmailStepValues;
      /*const res = await startLoginProcess(email);

        if (res.errors) {
          console.log(res.errors);
          setError((res.errors[0] as Error).toString());
        }

        if (res.user != null) {
          setUser(res.user as any);
        }

        setCurrentStep(res.nextScreen as LoginSteps);*/
    }
  };

  // Make sure that it doesnt go out of bounds
  if (steps[currentStep] == undefined || forms[currentStep] == undefined) {
    return <h1>You should not be seeing this</h1>;
  }

  return (
    <>
      <Form
        onSubmit={forms[currentStep].onSubmit((values) => handleSubmit(values))}
      >
        <Group grow>
          <Group grow>{steps[currentStep]}</Group>
          <Group
            sx={(theme) => ({
              position: "absolute",
              right: theme.spacing.lg,
              bottom: theme.spacing.md,
            })}
          >
            <ThemeToggle />
          </Group>
        </Group>
      </Form>
    </>
  );
}

export default LoginForm;
