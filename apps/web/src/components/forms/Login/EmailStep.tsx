import { Button, Group, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { At } from "tabler-icons-react";

export interface EmailStepValues {
  email: string;
}

type Props = {
  form: UseFormReturnType<EmailStepValues>;
  error?: string;
};

function FirstStep({ form, error }: Props) {
  return (
    <>
      <TextInput
        icon={<At size={20} />}
        size="md"
        required
        label="Käyttäjätunnus"
        placeholder="etunimi.sukunimi"
        error={error}
        {...form.getInputProps("email")}
      />

      <Group position="center" mt="xl" grow>
        <Button type="submit">Submit</Button>
      </Group>
    </>
  );
}

export default FirstStep;
