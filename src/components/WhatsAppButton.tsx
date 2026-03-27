import { MessageCircle } from 'lucide-react';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';

interface WhatsAppButtonProps {
  message?: string;
}

export default function WhatsAppButton({ message = 'Bonjour, je souhaite avoir des informations.' }: WhatsAppButtonProps) {
  const { entreprise } = useEntrepriseInfo();
  const whatsappUrl = `https://wa.me/${entreprise.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contacter par WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-[#25D366] text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
}
