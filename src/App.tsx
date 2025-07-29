import { invoke } from "@tauri-apps/api/core";
import { Form } from "radix-ui";

function App() {
  async function greet(text: string) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("speak", { text })
  }

  return (
    <main>
      <Form.Root onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = formData.get("text") as string;
        greet(text);
      }}>
        <Form.Field name="text">
          <Form.Label>文章</Form.Label>
          <Form.Control asChild>
            <textarea />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button>読み上げ</button>
        </Form.Submit>
      </Form.Root>
    </main>
  );
}

export default App;
