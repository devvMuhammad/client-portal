interface TextMessageProps {
  message: string;
}

export const TextMessage: React.FC<TextMessageProps> = ({ message }) => (
  <>
    <div className="text-sm leading-snug text-gray-500 dark:text-gray-400">
      {message}
    </div>
  </>
);
