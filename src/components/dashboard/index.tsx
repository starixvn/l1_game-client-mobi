import { Trans, withTranslation } from "next-i18next";
import Head from "next/head";
import { withRouter } from "next/router";
import React from "react";
import { isMobileOnly, isMobile } from "react-device-detect";
import { AuthorizeResponse, ReCheckInResponse, UMInfo, Response } from "sc-user-service-client/dist/auth";
import { Props, State } from "./type";
import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import LandscapeMode from "../../components/landscape-mode";
import { AuthContextProvider } from "../../contexts/auth";
import { GetLocalizedErrorMessage } from "../../helpers/notice-helper";
import { authorize, reCheckIn } from "../../services/auth-service";
import { updateSignInSMStatus, updateThemeSetting } from "../../services/user-setting-service";
import BetSettings from "../bet-settings";
import Games from "../games/games";
import Header from "../header";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import { UserStakeLevel } from "../shared/game-base/type";
import { GameGuideModal } from "./game-guide-modal";
import { HistoryModal } from "./history";
import Register from "./register";
import Styles from "./dashboard.module.scss";
import { io, Socket } from "socket.io-client";
import MsgpackParser from "socket.io-msgpack-parser";
import { isL1System, Themes } from "../../common/constants";
import { AnnouncementModal } from "./announcement";

const orientationType = { portrait: "portrait", landscape: "landscape" };
class Dashboard extends React.PureComponent<Props, State> {
    private notificationSocket: Socket = null;
    private reCheckInInterval: NodeJS.Timeout;
    private isKickOut = false;
    private showPromotion: NodeJS.Timeout;
    private readonly delayTimeShowPromotion = 120000;

    constructor(props: Props) {
        super(props);

        this.state = {
            orientation: "",
            enabledWinningStreakNotification: getLocalStorageItem(localStorageKeys.winningStreakNotification) ?? true,
            enabledPlaySound: getLocalStorageItem(localStorageKeys.playSound) ?? false,
            favoriteGames: getLocalStorageItem(localStorageKeys.favoriteGames) ?? [],
            userStakeLevel: { minBet: 0, maxBet: 0 },
            authorizeInfo: null,
            isShowErrorModal: false,
            apiError: null,
            isShowHistory: false,
            isShowGuide: false,
            isShowAnnouncement: false,
            enabledQuickBet: false,
            betValue: isL1System() ? 1 : 10,
            isBlockUI: false,
            isShowSlidingChip: isMobileOnly ? false : true,
            isShowBoostedOdds: true,
            isNewPromotion: false,
            promotionNotifications: [],
            promotions: [{ gameId: 0, _id: "id", endDateTime: "", isDaily: false, odds: {}, startDateTime: "", status: ",", time: "" }],
            queryGame: this.props.queryGame,
            isJoinGame: false,
        };

        this.handleFirstLogin = this.handleFirstLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.registerMainSocketEvent = this.registerMainSocketEvent.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.winningStreakNotificationToggle = this.winningStreakNotificationToggle.bind(this);
        this.playSoundToggle = this.playSoundToggle.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
        this.toggleGuideModal = this.toggleGuideModal.bind(this);
        this.handleReload = this.handleReload.bind(this);
        this.updateAuthorizeInfo = this.updateAuthorizeInfo.bind(this);
        this.updateUserBalance = this.updateUserBalance.bind(this);
        this.handleShowApiErrorMessage = this.handleShowApiErrorMessage.bind(this);
        this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
        this.toggleGuideModal = this.toggleGuideModal.bind(this);
        this.updateFavoriteGames = this.updateFavoriteGames.bind(this);
        this.setEnabledQuickBet = this.setEnabledQuickBet.bind(this);
        this.setBetValue = this.setBetValue.bind(this);
        this.handleUpdateUserStakeLevel = this.handleUpdateUserStakeLevel.bind(this);
        this.signOut = this.signOut.bind(this);
        this.toggleSlidingChip = this.toggleSlidingChip.bind(this);
        this.handleOrientation = this.handleOrientation.bind(this);
        this.toggleAnnouncementModal = this.toggleAnnouncementModal.bind(this);
        this.handlePromotions = this.handlePromotions.bind(this);
        this.handlePromotionNotifications = this.handlePromotionNotifications.bind(this);
        this.updateQueryGame = this.updateQueryGame.bind(this);

        const buildId = process.env.buildVersion;
        const buildVersion = getLocalStorageItem(localStorageKeys.buildVersion) ?? 0;
        if (buildId !== buildVersion) {
            storeLocalStorageItem(localStorageKeys.buildVersion, buildId);
            buildVersion && location.reload();
        }
    }

    updateFavoriteGames(favoriteGames: number[]) {
        this.setState({
            favoriteGames: favoriteGames,
        });
        storeLocalStorageItem(localStorageKeys.favoriteGames, favoriteGames);
    }

    updateAuthorizeInfo(authorizeInfo: AuthorizeResponse) {
        this.checkOfferedGame(authorizeInfo);
        this.setState({ authorizeInfo, enabledQuickBet: authorizeInfo?.user?.settings?.quickBet });
    }

    updateUserBalance(balance: number) {
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo && authorizeInfo.authorized && authorizeInfo.user.red !== balance) {
            authorizeInfo.user.red = balance;
            this.setState({ authorizeInfo });
        }
    }

    handleShowApiErrorMessage(errorCode: string, isDisableAccount = false) {
        if (isDisableAccount || errorCode === "1001" || errorCode === "1002") {
            this.isKickOut = true;
            setTimeout(() => {
                this.signOut();
            }, 10000);
        }

        this.setState({ isShowErrorModal: true, isBlockUI: false, apiError: { errorCode, message: GetLocalizedErrorMessage(errorCode) } });
    }

    signOut() {
        this.props.router.push("/timeout");
    }

    checkOfferedGame(authorizeInfo) {
        if (authorizeInfo?.user?.offerGames && authorizeInfo?.user?.offerGames.length === 0) {
            this.setState({
                apiError: {
                    message: "messages:noGameOffer",
                    errorCode: "",
                },
                isShowErrorModal: true,
                isBlockUI: true,
            });
        }
    }

    handleRecheckInResponse(response: ReCheckInResponse) {
        if (!response || !response.isSuccessful) {
            this.signOut();
        } else {
            if (response.apiError) {
                this.handleShowApiErrorMessage(response.apiError.errorCode, response.isDisableAccount);
            } else {
                this.updateUserBalance(response.balance);
            }
        }
    }

    handleOrientation() {
        setTimeout(() => {
            this.setState({ orientation: window.innerHeight < window.innerWidth ? orientationType.landscape : orientationType.portrait });
        }, 200);
    }

    async componentDidMount() {
        const { session } = this.props;
        const authorizeResponse = await authorize(session);

        const errorResponse = authorizeResponse as Response;

        if (errorResponse && errorResponse.errorCode === "SB0002") {
            this.props.router.push("/timeout");
            return;
        }

        const authorizeInfo = authorizeResponse as AuthorizeResponse;

        this.updateAuthorizeInfo(authorizeInfo);

        this.updateUserBalance(authorizeInfo?.user?.red);

        this.reCheckInInterval = setInterval(async () => {
            const reCheckInResponse = await reCheckIn(this.props.session);
            this.handleRecheckInResponse(reCheckInResponse);
        }, 60 * 1000);

        if (isMobile) {
            window.addEventListener("orientationchange", this.handleOrientation, false);
        }

        this.connectNotificationSocket();
    }

    componentWillUnmount() {
        this.notificationSocket?.close();
        clearInterval(this.reCheckInInterval);
    }

    sendMessage(data: any) {
        this.notificationSocket.emit(JSON.stringify(data));
    }

    connectNotificationSocket() {
        const { proxy, enableMsgpackParser } = appSettings;
        const { session } = this.props;
        const socketUri = `${proxy.ssl ? "https" : "http"}://${proxy.uri}/`;
        const socketOption = {
            forceNew: false,
            transports: ["websocket"],
            upgrade: false,
            auth: {
                ss: session.ss,
                username: session.username,
            },
            path: `${proxy.path}/notification/socket.io`,
            parser: enableMsgpackParser ? MsgpackParser : undefined,
        };

        this.notificationSocket = io(socketUri, socketOption);
        this.notificationSocket && this.notificationSocket.emit("promotionNotifications");
        this.registerMainSocketEvent(this.notificationSocket);
    }

    registerMainSocketEvent(mainSocket: Socket) {
        mainSocket.on("auth", this.handleAuth);
        mainSocket.on("kickedOut", this.handleKickedOut);
        mainSocket.on("reload", this.handleReload);
        mainSocket.on("promotions", this.handlePromotions);
        mainSocket.on("promotionNotifications", this.handlePromotionNotifications);
    }

    handlePromotions(data) {
        const { promotions, isShowBoostedOdds } = this.state;
        if (data.length > 0) {
            let haveNewPromotion = data.length > promotions.length;
            if (!haveNewPromotion) {
                const filterNewPromotion = data.filter(
                    (newPromotion) =>
                        !promotions.some(
                            (currentPromotion) =>
                                newPromotion._id === currentPromotion._id &&
                                newPromotion.startDateTime === currentPromotion.startDateTime &&
                                newPromotion.endDateTime === currentPromotion.endDateTime
                        )
                );
                haveNewPromotion = filterNewPromotion.length > 0;
            }

            if (haveNewPromotion || isShowBoostedOdds) {
                this.setState({ isNewPromotion: true });
                clearTimeout(this.showPromotion);
                this.showPromotion = setTimeout(() => {
                    this.setState({ isShowBoostedOdds: true });
                }, this.delayTimeShowPromotion);
            }
            setTimeout(() => {
                this.setState({ isNewPromotion: false });
            }, 10000);
            this.setState({ promotions: data, isShowBoostedOdds: false });
        }
    }

    handlePromotionNotifications(data) {
        this.setState({ promotionNotifications: data });
        if (data.length < 1) {
            this.setState({ isShowAnnouncement: false });
        }
    }

    handleAuth(authData) {
        if (!authData.authorized) {
            this.handleKickedOut(authData);
        }
    }

    handleReload() {
        window.location.reload();
    }

    handleKickedOut(data: any) {
        const { umInfo } = data;
        const { router, setIsUm } = this.props;

        if (umInfo) {
            this.reCheckInInterval && clearInterval(this.reCheckInInterval);
            storeLocalStorageItem<UMInfo>(localStorageKeys.umInfo, umInfo);
            setTimeout(() => {
                setIsUm(true);
            }, 500);
        } else {
            router.push("/timeout");
        }
    }

    handleFirstLogin() {
        const { session } = this.props;
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo && authorizeInfo.authorized) {
            updateSignInSMStatus(session);
            updateThemeSetting(session);

            authorizeInfo.user.settings = { theme: Themes.light };
            authorizeInfo.user.isSignedInSM = true;

            this.updateAuthorizeInfo(authorizeInfo);
        }
    }

    handleUpdateUserStakeLevel(userStakeLevel: UserStakeLevel) {
        this.setState({ userStakeLevel: userStakeLevel });
    }

    handleRegister(authorizeInfo: AuthorizeResponse) {
        const { session } = this.props;

        updateSignInSMStatus(session);
        authorizeInfo.user.isSignedInSM = true;
        updateThemeSetting(session);

        this.updateAuthorizeInfo(authorizeInfo);
    }

    winningStreakNotificationToggle() {
        const { enabledWinningStreakNotification } = this.state;
        this.setState({ enabledWinningStreakNotification: !enabledWinningStreakNotification });
        storeLocalStorageItem(localStorageKeys.winningStreakNotification, !enabledWinningStreakNotification);
    }

    playSoundToggle() {
        const { enabledPlaySound } = this.state;
        this.setState({ enabledPlaySound: !enabledPlaySound });
        storeLocalStorageItem(localStorageKeys.playSound, !enabledPlaySound);
    }

    setEnabledQuickBet(enabled: boolean) {
        this.setState({ enabledQuickBet: enabled });
    }

    setBetValue(value: number) {
        this.setState({ betValue: value });
    }

    closeDialog() {
        this.setState({ isShowErrorModal: false });
        this.isKickOut && this.signOut();
    }

    toggleHistoryModal() {
        this.setState({ isShowHistory: !this.state.isShowHistory });
    }

    toggleGuideModal() {
        this.setState({ isShowGuide: !this.state.isShowGuide });
    }

    toggleSlidingChip() {
        isMobileOnly && this.setState({ isShowSlidingChip: !this.state.isShowSlidingChip });
    }

    toggleAnnouncementModal() {
        this.setState({ isShowAnnouncement: !this.state.isShowAnnouncement });
    }

    updateQueryGame(gameId: number, isJoinGame: boolean) {
        const queryGame = isJoinGame ? gameId : this.props.queryGame;
        this.setState({ queryGame: queryGame, isJoinGame: isJoinGame });
    }

    renderDashBoard() {
        const {
            enabledWinningStreakNotification,
            enabledPlaySound,
            isShowErrorModal,
            isShowHistory,
            isShowGuide,
            isShowAnnouncement,
            userStakeLevel,
            favoriteGames,
            authorizeInfo,
            enabledQuickBet,
            betValue,
            isBlockUI,
            isShowSlidingChip,
            isShowBoostedOdds,
            promotionNotifications,
            isNewPromotion,
            queryGame,
            isJoinGame,
        } = this.state;
        const authContextValue = { session: this.props.session, setBalance: this.updateUserBalance, signOut: this.signOut };
        const offerGames: number[] = authorizeInfo.user.offerGames.map((game: any) => game?.gameId);
        return (
            <AuthContextProvider value={authContextValue}>
                <div className={Styles["dashboard"]}>
                    <Header
                        user={authorizeInfo.user}
                        enabledNotification={enabledWinningStreakNotification}
                        enabledSound={enabledPlaySound}
                        onToggleNotification={this.winningStreakNotificationToggle}
                        onToggleSound={this.playSoundToggle}
                        toggleHistoryModal={this.toggleHistoryModal}
                        toggleGuideModal={this.toggleGuideModal}
                        toggleAnnouncementModal={this.toggleAnnouncementModal}
                        favoriteGames={favoriteGames}
                        offerGames={offerGames}
                        updateFavoriteGames={this.updateFavoriteGames}
                        enabledQuickBet={enabledQuickBet}
                        updateEnabledQuickBet={this.setEnabledQuickBet}
                        isShowBoostedOdds={isShowBoostedOdds}
                        promotionNotifications={promotionNotifications}
                    />
                    <Games
                        enabledQuickBet={enabledQuickBet}
                        betValue={betValue}
                        enabledWinningStreakNotification={enabledWinningStreakNotification}
                        enabledPlaySound={enabledPlaySound}
                        setApiErrorMessage={this.handleShowApiErrorMessage}
                        userStakeLevel={userStakeLevel}
                        updateUserStakeLevel={this.handleUpdateUserStakeLevel}
                        updateFavoriteGames={this.updateFavoriteGames}
                        favoriteGames={favoriteGames}
                        userOfferGames={offerGames}
                        queryGame={queryGame}
                        isShowSlidingChip={isShowSlidingChip}
                        updateQueryGames={this.updateQueryGame}
                        isJoinGame={isJoinGame}
                    />
                    <BetSettings
                        enabledQuickBet={enabledQuickBet}
                        updateEnabledQuickBet={this.setEnabledQuickBet}
                        updateBetValue={this.setBetValue}
                        enabledSound={enabledPlaySound}
                        user={authorizeInfo.user}
                        toggleSlidingChip={this.toggleSlidingChip}
                        isShowSlidingChip={isShowSlidingChip}
                        toggleAnnouncementModal={this.toggleAnnouncementModal}
                        betValue={betValue}
                        isNewPromotion={isNewPromotion}
                    />
                    {isShowHistory && <HistoryModal onCloseModal={this.toggleHistoryModal} offerGames={offerGames} />}
                    {isShowAnnouncement && (
                        <AnnouncementModal
                            onCloseModal={this.toggleAnnouncementModal}
                            promotionNotifications={promotionNotifications}
                            updateQueryGame={this.updateQueryGame}
                        />
                    )}
                    {isShowGuide && (
                        <GameGuideModal
                            userStakeLevel={userStakeLevel}
                            onCloseModal={this.toggleGuideModal}
                            offerGames={offerGames}
                            user={authorizeInfo.user}
                        />
                    )}
                    {isShowErrorModal && (
                        <div className={Styles["container-modal"]}>
                            <div className={`${Styles["bg-opacity"]} ${isBlockUI ? Styles["block-ui-backdrop"] : ""}`}></div>
                            <BaseDialog
                                type={ModalType.Center}
                                isOpen={isShowErrorModal}
                                onCloseModal={this.closeDialog}
                                isBlockUI={isBlockUI}
                            >
                                <div className={`modal-center ${isBlockUI ? Styles["block-ui-message"] : ""}`}>
                                    <div className={`icon-warning modal-icon-warning`}></div>
                                    {!isBlockUI && <div className={`icon-close modal-icon-close`} onClick={this.closeDialog}></div>}

                                    <Trans t={this.props.t}>
                                        {this.props.t(this.state.apiError?.message, { errorCode: this.state.apiError?.errorCode })}
                                    </Trans>
                                </div>
                            </BaseDialog>
                        </div>
                    )}
                </div>
            </AuthContextProvider>
        );
    }

    renderComponents(authorizeInfo: AuthorizeResponse) {
        const { authorized } = authorizeInfo;
        if (authorized) {
            return this.renderDashBoard();
        }

        return <Register session={this.props.session} handleStateLogin={this.handleRegister} />;
    }

    renderGoogleAnalytic() {
        if (appSettings.googleAnalyticId == null) {
            return <></>;
        }

        return (
            <>
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${appSettings.googleAnalyticId}`}></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${appSettings.googleAnalyticId}', {
                            page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
            </>
        );
    }

    render() {
        const { orientation, authorizeInfo } = this.state;

        if (orientation === orientationType.landscape && isMobileOnly) {
            return <LandscapeMode />;
        }

        return authorizeInfo ? (
            <>
                <Head>{this.renderGoogleAnalytic()}</Head>
                {this.renderComponents(authorizeInfo)}
            </>
        ) : (
            <></>
        );
    }
}

export default withRouter(withTranslation()(Dashboard));
