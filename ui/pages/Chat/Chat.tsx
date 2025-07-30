import { Form } from "radix-ui";
import { useSpeak } from "../../api/hooks.ts";
import { Textarea } from "./components/Textarea.tsx";
import { IconButton } from "./components/IconButton.tsx";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";

type ChatForm = {
  text: string;
}

export const Chat = () => {
  const { mutate: speak } = useSpeak();
  const { formState: { isValid }, handleSubmit, register, reset } = useForm<ChatForm>()
  const onSubmit = (data: ChatForm) => {
    speak(data.text);
    reset();
  }

  return <Form.Root onSubmit={handleSubmit(onSubmit)}>
    <Form.Field name="text">
      <Form.Label>文章</Form.Label>
      <Form.Control asChild>
        <Textarea {...register('text', { required: true })} />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
      <IconButton type="submit" label="送信" disabled={!isValid}>
        <PaperPlaneIcon />
      </IconButton>
    </Form.Submit>
  </Form.Root>
}
