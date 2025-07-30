import { Form } from "radix-ui";
import { useSpeak } from "../../api/hooks.ts";
import { Textarea } from "./components/Textarea.tsx";
import { IconButton } from "./components/IconButton.tsx";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

export const Chat = () => {
  const { mutate: speak } = useSpeak();


  return <Form.Root onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    speak(text);
  }}>
    <Form.Field name="text">
      <Form.Label>文章</Form.Label>
      <Form.Control asChild>
        <Textarea />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
      <IconButton type="submit" label="送信">
        <PaperPlaneIcon />
      </IconButton>
    </Form.Submit>
  </Form.Root>
}
