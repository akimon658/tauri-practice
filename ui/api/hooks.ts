import { useMutation } from "@tanstack/react-query"
import { commands } from "./bindings.gen.ts"

export const useSendMessage = (onSuccess: (res: string) => void) => {
  const mutation = useMutation({
    mutationKey: ["send_message"],
    mutationFn: commands.sendMessage,
    onSuccess: onSuccess,
  })

  return mutation
}

export const useSpeak = () => {
  const mutation = useMutation({
    mutationKey: ["speak"],
    mutationFn: commands.speak,
  })

  return mutation
}
