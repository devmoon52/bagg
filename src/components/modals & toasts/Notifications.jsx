import {
  BellRing,
  CheckCircle2,
  CreditCard,
  Heart,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  ShoppingBag,
  Tag,
  Truck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const notificationIcons = {
  checkCircle: CheckCircle2,
  truck: Truck,
  tag: Tag,
  heart: Heart,
  packageCheck: PackageCheck,
  bellRing: BellRing,
  shoppingBag: ShoppingBag,
  packageOpen: PackageOpen,
  rotateCcw: RotateCcw,
  creditCard: CreditCard,
  userRound: UserRound,
  walletCards: WalletCards,
};

const Notifications = ({ isOpen, onClose }) => {
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed right-0 top-0 z-9998 bg-white max-w-xl w-full px-3 py-2 h-dvh flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <button
        aria-label="Close notification modal"
        onClick={onClose}
        className="absolute right-2 top-2 cursor-pointer"
      >
        <X aria-hidden="true" />
      </button>

      <div className="">
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto">
        <ul className="space-y-1 h-full">
          {notifications.map((notification, i) => {
            const Icon = notificationIcons[notification.icon];

            return (
              <li
                key={notification.id}
                className={`${i > 0 && "border-t"} border-gray-300 py-4 flex items-start gap-2`}
              >
                <div className="bg-green-pastel/40 text-[#668b4d] w-10 h-10 rounded-full flex justify-center items-center shrink-0">
                  <Icon strokeWidth={1.6} />
                </div>
                <div>
                  <h2 className="font-medium">{notification.heading}</h2>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-sm text-[#668b4d]">
                    {notification.isNew
                      ? "Today"
                      : notification.dateType === "day"
                        ? `${notification.date} days ago`
                        : `${notification.date} weeks ago`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
