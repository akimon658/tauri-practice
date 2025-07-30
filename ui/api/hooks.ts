import { useMutation } from "@tanstack/react-query"
import { commands } from "./bindings.ts"

export const useSpeak = () => {
  const mutation = useMutation({
    mutationKey: ["speak"],
    mutationFn: commands.speak,
  })

  return mutation
}
