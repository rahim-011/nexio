interface NotificationCircleProps {
    value: number;
}

export default function NotificationCircle({ value }: NotificationCircleProps) {
    if (value <= 0) return null;

    return (
        <div className="flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-semibold text-white">
            {value > 99 ? "99+" : value}
        </div>
    );
}