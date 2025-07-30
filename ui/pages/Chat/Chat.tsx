import { Form } from "radix-ui";
import { useSpeak } from "../../api/hooks.ts";
import { Textarea } from "./components/Textarea.tsx";

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
      <button>読み上げ</button>
    </Form.Submit>
  </Form.Root>
}
