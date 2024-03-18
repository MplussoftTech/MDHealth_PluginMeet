import React, { useMemo, useState, Fragment, useEffect } from 'react';
import { Room } from 'livekit-client';
import { createSelector } from '@reduxjs/toolkit';
import { Dialog, Transition } from '@headlessui/react';

import { RootState, store, useAppDispatch, useAppSelector } from '../../store';

import WebcamIcon from './icons/webcam';
import MicrophoneIcon from './icons/microphone';
import ModalDialog from 'video.js/dist/types/modal-dialog';
import ChatIcon from './icons/chat';
import ParticipantIcon from './icons/participant';
import RaiseHandIcon from './icons/raisehand';
import ScreenshareIcon from './icons/screenshare';
import RecordingIcon from './icons/recording';
import MenusIcon from './icons/menus';
import SharedNotePadIcon from './icons/sharedNotePad';
import WhiteboardIcon from './icons/whiteboard';
import BreakoutRoomInvitation from '../breakout-room/breakoutRoomInvitation';
import { toggleFooterVisibility } from '../../store/slices/roomSettingsSlice';
import { useTranslation } from 'react-i18next';
import sendAPIRequest from '../../helpers/api/plugNmeetAPI';
import { toast } from 'react-toastify';
import {
  CommonResponse,
  RoomEndAPIReq,
} from '../../helpers/proto/plugnmeet_common_api_pb';

interface IFooterProps {
  currentRoom: Room;
  isRecorder: boolean;
}

const footerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleFooter,
);

const roomTitleSelector = createSelector(
  (state: RootState) => state.session.currentRoom.metadata,
  (metadata) => metadata?.room_title,
);

interface IHeaderMenusProps {
  onOpenAlert(task: string): void;
}
const Footer = ({ currentRoom, isRecorder }: IFooterProps) => {
  const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
  const footerVisible = useAppSelector(footerVisibilitySelector);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  console.log(showModal);
  const [alertText, setAlertText] = useState('');
  const [title, setTitle] = useState<string>('');
  const [task, setTask] = useState('');
  const { t } = useTranslation();
  const roomTitle = useAppSelector(roomTitleSelector);

  useEffect(() => {
    if (roomTitle) {
      setTitle(roomTitle);
    }
  }, [roomTitle, showModal]);


  const onCloseAlertModal = async (shouldDo = false) => {
    setShowModal(false);
    if (!shouldDo) {
      return;
    }

    if (task === 'logout') {
      await currentRoom.disconnect();
    } else if (task === 'end Room') {
      const session = store.getState().session;

      const body = new RoomEndAPIReq({
        roomId: session.currentRoom.room_id,
      });

      const r = await sendAPIRequest(
        'endRoom',
        body.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer',
      );
      const res = CommonResponse.fromBinary(new Uint8Array(r));
      if (!res.status) {
        toast(res.msg, {
          type: 'error',
        });
      }
    }
  };

  const alertModal = () => {
    return (
      <>
        <Transition appear show={showModal} as={Fragment}>
          <Dialog
            as="div"
            className="AlertModal fixed inset-0 z-[9999] overflow-y-auto"
            onClose={() => false}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-darkPrimary shadow-xl rounded-2xl">
                  <button
                    className="close-btn absolute top-8 right-6 w-[25px] h-[25px] outline-none"
                    type="button"
                    onClick={() => onCloseAlertModal()}
                  >
                    <span className="inline-block h-[1px] w-[20px] bg-primaryColor dark:bg-darkText absolute top-0 left-0 rotate-45" />
                    <span className="inline-block h-[1px] w-[20px] bg-primaryColor dark:bg-darkText absolute top-0 left-0 -rotate-45" />
                  </button>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {t('header.menus.alert.confirm')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-darkText">
                      {alertText}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 ltr:mr-4 rtl:ml-4 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => onCloseAlertModal(true)}
                    >
                      {t('ok')}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-primaryColor hover:bg-secondaryColor text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => onCloseAlertModal(false)}
                    >
                      {t('close')}
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  const onOpenAlert = (task) => {
    setTask(task);
    if (task === 'logout') {
      setAlertText(t('header.menus.alert.logout').toString());
    } else if (task === 'end Room') {
      console.log(showModal);
      setAlertText(t('header.menus.alert.end').toString());
    }
    setShowModal(true);
    console.log(showModal);
  };

  const endRoom = () => {
    console.log('sxyads');
    onOpenAlert('end Room');
  };

  return useMemo(() => {
    return (
      <>
        <Transition
          show={footerVisible}
          unmount={false}
          enter="transform duration-200 transition ease-in"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform duration-200 transition ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <footer
            id="main-footer"
            className={`px-2 md:px-4 shadow-footer flex items-center justify-between dark:bg-darkPrimary h-[55px] lg:h-[60px]`}
            style={{ display: isRecorder ? 'none' : '' }}
          >
            <div className="footer-inner flex items-center justify-between w-full rtl:flex-row-reverse">
              {/* <div className="footer-left w-52 flex items-center relative z-50 rtl:justify-end">
                
              </div> */}

              <div className="footer-middle flex items-center" style={{ position: 'absolute', left: 'calc(50% - 64px)', bottom: '90px' }}>
                <WebcamIcon currentRoom={currentRoom} />
                {/* <EndCallBtn onOpenAlert={(e) => onOpenAlert(e)} /> */}
                {/* <HeaderMenus onOpenAlert={(e) => onOpenAlert(e)} /> */}
                <button onClick={() => endRoom()} style={{zIndex: 10 , marginRight: '17px'}}>
                  <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="31" cy="31" r="31" fill="#F31D1D" />
                    <g clip-path="url(#clip0_1_9)">
                      <path d="M31 26.75C28.7333 26.75 26.5375 27.1042 24.4833 27.77V32.1617C24.4833 32.7142 24.1575 33.21 23.69 33.4367C22.3017 34.1308 21.0408 35.0233 19.9217 36.0575C19.6667 36.3125 19.3125 36.4542 18.93 36.4542C18.5333 36.4542 18.1792 36.2983 17.9242 36.0433L14.4108 32.53C14.2784 32.4014 14.1736 32.2471 14.103 32.0766C14.0323 31.9061 13.9973 31.7229 14 31.5383C14 31.1417 14.1558 30.7875 14.4108 30.5325C18.7317 26.4383 24.5683 23.9167 31 23.9167C37.4317 23.9167 43.2683 26.4383 47.5892 30.5325C47.8442 30.7875 48 31.1417 48 31.5383C48 31.935 47.8442 32.2892 47.5892 32.5442L44.0758 36.0575C43.8208 36.3125 43.4667 36.4683 43.07 36.4683C42.6875 36.4683 42.3333 36.3125 42.0783 36.0717C40.9507 35.02 39.6766 34.1372 38.2958 33.4508C38.057 33.3345 37.8558 33.1532 37.7155 32.9276C37.5751 32.7021 37.5013 32.4415 37.5025 32.1758V27.7842C35.4625 27.1042 33.2667 26.75 31 26.75Z" fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_9">
                        <rect width="34" height="34" fill="white" transform="translate(14 14)" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <MicrophoneIcon currentRoom={currentRoom} />
              </div>

              <div className="footer-right w-52 hidden sm:flex items-center" />
              <BreakoutRoomInvitation currentRoom={currentRoom} />
            </div>
            {/* <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-darkPrimary shadow-xl rounded-2xl"><button className="close-btn absolute top-8 right-6 w-[25px] h-[25px] outline-none" type="button"><span className="inline-block h-[1px] w-[20px] bg-primaryColor dark:bg-darkText absolute top-0 left-0 rotate-45"></span><span className="inline-block h-[1px] w-[20px] bg-primaryColor dark:bg-darkText absolute top-0 left-0 -rotate-45"></span></button><h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="headlessui-dialog-title-:rt:" data-headlessui-state="open">Are you sure?</h3><div className="mt-2"><p className="text-sm text-gray-500 dark:text-darkText">You are about to end the session. All users will be disconnected.</p></div><div className="mt-4"><button className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 ltr:mr-4 rtl:ml-4 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">Ok</button><button type="button" className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-primaryColor hover:bg-secondaryColor text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">Close</button></div></div> */}
            {showModal && (<>
              <Transition appear show={showModal} as={Fragment}>
                <Dialog
                  as="div"
                  className="AlertModal fixed inset-0 z-[9999] overflow-y-auto"
                  onClose={() => false}
                >
                  <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>

                    <span
                      className="inline-block h-screen align-middle"
                      aria-hidden="true"
                    >
                      &#8203;
                    </span>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-darkPrimary shadow-xl rounded-2xl">
                        <button
                          className="close-btn absolute top-8 right-6 w-[25px] h-[25px] outline-none"
                          type="button"
                          onClick={() => onCloseAlertModal()}
                        >
                          <span className="inline-block h-[1px] w-[20px] bg-primaryColor dark:bg-darkText absolute top-0 left-0 rotate-45" />
                          <span className="inline-block h-[1px] w-[20px] bg-primaryColor dark:bg-darkText absolute top-0 left-0 -rotate-45" />
                        </button>

                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                        >
                          {t('header.menus.alert.confirm')}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-darkText">
                            {alertText}
                          </p>
                        </div>

                        <div className="mt-4">
                          <button
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 ltr:mr-4 rtl:ml-4 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={() => onCloseAlertModal(true)}
                          >
                            {t('ok')}
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-primaryColor hover:bg-secondaryColor text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={() => onCloseAlertModal(false)}
                          >
                            {t('close')}
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition>
            </>)}
          </footer>
        </Transition>
        {/* {isRecorder ? null : (
          <div
            className={`footer-collapse-arrow group fixed right-0 flex items-end justify-center h-5 w-[50px] cursor-pointer z-[1] bg-white dark:bg-darkPrimary rounded-tl-lg ${
              footerVisible ? 'bottom-[60px] pb-[3px]' : 'bottom-0 pb-[6px]'
            }`}
            onClick={() => dispatch(toggleFooterVisibility())}
          >
            <i
              className={` text-[10px] sm:text-[12px] dark:text-secondaryColor pnm-arrow-below ${
                footerVisible ? '' : 'rotate-180'
              }`}
            ></i>
            <span className="absolute right-0 bottom-7 w-max text-darkPrimary dark:text-white bg-white dark:bg-darkPrimary text-[12px] py-1 px-[10px] rounded opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
              {footerVisible
                ? t('footer.hide-footer')
                : t('footer.show-footer')}
            </span>
          </div>
        )} */}
      </>
    );
    //eslint-disable-next-line
  }, [currentRoom, footerVisible, showModal]);
};

export default Footer;
