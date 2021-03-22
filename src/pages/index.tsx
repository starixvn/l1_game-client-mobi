import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

import * as SessionManager from "../common/auth/session-manager"
import { AuthContextProvider } from "../components/contexts/auth"
import Dashboard from "../components/dashboard"
import { UserService } from "../services"
import { Session } from "../services/user/user"

export default function Home() {
    const router = useRouter()
    const { t } = useTranslation("common")
    const [loading, setLoading] = useState<boolean>(true)
    const [session, setSession] = useState<Session>(null)
    const [balance, setBalance] = useState<number>(0)
    const timer = useRef(null)

    async function signIn() {
        const { token } = router.query

        if (token) {
            const userSession = await UserService.signIn(token as string)
            if (userSession && userSession.isAuthenticated) {
                handleSignInSuccess(userSession)
            } else {
                router.push("/timeout")
            }
        } else {
            const userSession = SessionManager.getSession()
            if (!userSession) {
                router.push("/timeout")
            }

            const verifySessionResponse = await UserService.verifySession(
                userSession
            )
            if (verifySessionResponse && verifySessionResponse.isSuccessful) {
                handleSignInSuccess(userSession)
            } else {
                router.push("/timeout")
            }
        }
    }

    function handleSignInSuccess(userSession: Session) {
        setSession(userSession)
        SessionManager.storeSessionData(userSession)
        reCheckIn(userSession)
        window.history.pushState(null, "", location.href.split("?")[0])
        setTimeout(() => setLoading(false), 1000)
    }

    function reCheckIn(userSession: Session) {
        timer.current = setInterval(async () => {
            const reCheckInResult = await UserService.reCheckIn(userSession)
            if (!reCheckInResult || !reCheckInResult.isSuccessful) {
                router.push("/timeout")
            } else {
                setBalance(reCheckInResult.balance)
            }
        }, 60 * 1000)
    }

    useEffect(() => {
        if (router.isReady) {
            signIn()
        }
    }, [router.isReady])

    if (loading) {
        return <div>Loading...</div>
    } else {
        return (
            <AuthContextProvider value={session}>
                <Dashboard balance={balance} updateBalance={setBalance} />
            </AuthContextProvider>
        )
    }
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            "common",
            "footer",
            "header",
            "xocxoc",
            "kenopromax",
            "bigsmall",
        ])),
    },
})
