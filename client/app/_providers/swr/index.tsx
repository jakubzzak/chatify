"use client"

import { SWRConfig } from '@/app/_providers/swr/SWRConfig'
import {useRouter} from "next/navigation";

export const SWRProvider = ({ children }) => {
  const router = useRouter()

  function endSession() {
    window.localStorage.removeItem('state')
    window.localStorage.removeItem('state')

    router.push("/tool")
  }

  return (
    <SWRConfig onUnauthorized={endSession}>
      {children}
    </SWRConfig>
  )
}