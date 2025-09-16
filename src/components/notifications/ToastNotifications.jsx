import React from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationsContext';

const ToastNotifications = () => {
  const { toastNotifications, removeToast } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case NOTIFICATION_TYPES.ERROR:
        return <XCircleIcon className="h-6 w-6 text-red-400" />;
      case NOTIFICATION_TYPES.WARNING:
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />;
      case NOTIFICATION_TYPES.INFO:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
      case NOTIFICATION_TYPES.EVENT:
        return <CalendarIcon className="h-6 w-6 text-purple-400" />;
      case NOTIFICATION_TYPES.OPPORTUNITY:
        return <BriefcaseIcon className="h-6 w-6 text-indigo-400" />;
      case NOTIFICATION_TYPES.MESSAGE:
        return <ChatBubbleLeftIcon className="h-6 w-6 text-pink-400" />;
      case NOTIFICATION_TYPES.SYSTEM:
        return <CogIcon className="h-6 w-6 text-gray-400" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-50 border-green-200';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-50 border-red-200';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-50 border-yellow-200';
      case NOTIFICATION_TYPES.INFO:
        return 'bg-blue-50 border-blue-200';
      case NOTIFICATION_TYPES.EVENT:
        return 'bg-purple-50 border-purple-200';
      case NOTIFICATION_TYPES.OPPORTUNITY:
        return 'bg-indigo-50 border-indigo-200';
      case NOTIFICATION_TYPES.MESSAGE:
        return 'bg-pink-50 border-pink-200';
      case NOTIFICATION_TYPES.SYSTEM:
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (toastNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toastNotifications.map((notification) => (
        <Transition
          key={notification.id}
          show={true}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`rounded-lg border shadow-lg p-4 ${getBackgroundColor(notification.type)}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
                {notification.actionUrl && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        // Em produção, usar navigate do react-router
                        window.location.href = notification.actionUrl;
                      }}
                      className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  onClick={() => removeToast(notification.id)}
                >
                  <span className="sr-only">Fechar</span>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
};

export default ToastNotifications;