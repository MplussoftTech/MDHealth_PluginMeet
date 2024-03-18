import React, { useEffect, useState, Fragment } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Room } from 'livekit-client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useAppSelector, RootState, store, useAppDispatch } from '../../store';
import sendAPIRequest from '../../helpers/api/plugNmeetAPI';

import HeaderMenus from './menus';
import RoomSettings from './room-settings';
import './style.css';
import KeyboardShortcuts from './keyboardShortcuts';
import VolumeControl from './volumeControl';
import DurationView from './durationView';
import DarkThemeSwitcher from './darkThemeSwitcher';
import {
  CommonResponse,
  RoomEndAPIReq,
} from '../../helpers/proto/plugnmeet_common_api_pb';
import { toggleHeaderVisibility } from '../../store/slices/roomSettingsSlice';
import HeaderLogo from './headerLogo';

interface IHeaderProps {
  currentRoom: Room;
}

const roomTitleSelector = createSelector(
  (state: RootState) => state.session.currentRoom.metadata,
  (metadata) => metadata?.room_title,
);
const roomDurationSelector = createSelector(
  (state: RootState) => state.session.currentRoom.metadata?.room_features,
  (room_features) => room_features?.room_duration,
);
const headerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleHeader,
);

const Header = ({ currentRoom }: IHeaderProps) => {
  const roomTitle = useAppSelector(roomTitleSelector);
  const roomDuration = useAppSelector(roomDurationSelector);
  const headerVisible = useAppSelector(headerVisibilitySelector);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const [title, setTitle] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [alertText, setAlertText] = useState('');
  const [task, setTask] = useState('');
  const assetPath = (window as any).STATIC_ASSETS_PATH ?? './assets';

  useEffect(() => {
    if (roomTitle) {
      setTitle(roomTitle);
    }
  }, [roomTitle]);

  const onOpenAlert = (task) => {
    setTask(task);
    if (task === 'logout') {
      setAlertText(t('header.menus.alert.logout').toString());
    } else if (task === 'end Room') {
      setAlertText(t('header.menus.alert.end').toString());
    }
    setShowModal(true);
  };

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

  return (
    <></>
  );
};

export default React.memo(Header);
