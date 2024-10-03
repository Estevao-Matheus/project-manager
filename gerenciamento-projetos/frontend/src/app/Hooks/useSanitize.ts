
import DOMPurify from 'dompurify';

const useSanitize = () => {
  const sanitize = (dirty: string) => {
    return DOMPurify.sanitize(dirty);
  };

  return { sanitize };
};

export default useSanitize;
