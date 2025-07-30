import { useMutation } from "@tanstack/react-query"
import { commands } from "./bindings.gen.ts"

export const useSpeak = () => {
  const mutation = useMutation({
    mutationKey: ["speak"],
    mutationFn: commands.speak,
  })

  return mutation
}
