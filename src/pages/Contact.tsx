import { useState } from 'react';
import { 
  MapPin, Phone, Mail, Send, Facebook, 
  CheckCircle, MessageSquare 
} from 'lucide-react';
import { createContact } from '../api/contacts';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';

export default function Contact() {
  const { entreprise } = useEntrepriseInfo();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    objet: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createContact({
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email || null,
        objet: formData.objet,
        message: formData.message,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ nom: '', telephone: '', email: '', objet: '', message: '' });
      }, 3000);
    } catch (err) {
      setSubmitError('Une erreur est survenue. Merci de rÃ©essayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative py-16 bg-[#0D354E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-script text-2xl text-[#7A9E9F]">Restons en contact</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              Contactez-nous
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              et vous accompagner dans vos projets immobiliers.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-[#0D354E] mb-6">
                  Nos coordonnées
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#7A9E9F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#7A9E9F]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0D354E] mb-1">Adresse</h3>
                      <p className="text-gray-600 text-sm">{entreprise.adresse}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#7A9E9F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#7A9E9F]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0D354E] mb-1">Téléphone</h3>
                      <a 
                        href={`tel:${entreprise.telephone.replace(/\s/g, '')}`}
                        className="text-gray-600 text-sm hover:text-[#7A9E9F] transition-colors"
                      >
                        {entreprise.telephone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#7A9E9F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0D354E] mb-1">WhatsApp</h3>
                      <a 
                        href={`https://wa.me/${entreprise.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 text-sm hover:text-[#25D366] transition-colors"
                      >
                        {entreprise.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#7A9E9F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#7A9E9F]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0D354E] mb-1">Email</h3>
                      <a 
                        href={`mailto:${entreprise.email}`}
                        className="text-gray-600 text-sm hover:text-[#7A9E9F] transition-colors"
                      >
                        {entreprise.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#7A9E9F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#7A9E9F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0D354E] mb-1">Horaires</h3>
                      <div className="text-gray-600 text-sm space-y-1">
                        {Object.entries(entreprise.horaires).map(([jour, horaire]) => (
                          <p key={jour} className="capitalize">
                            {jour}: {horaire}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-[#0D354E] mb-4">Suivez-nous</h3>
                <a
                  href={entreprise.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#1877F2]/10 rounded-lg text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="font-medium">{entreprise.facebook}</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-[#0D354E] mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600 mb-6">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0D354E] mb-2">
                      Message envoyé !
                    </h3>
                    <p className="text-gray-600">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent"
                          placeholder="+242 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="objet" className="block text-sm font-medium text-gray-700 mb-2">
                          Objet *
                        </label>
                        <select
                          id="objet"
                          name="objet"
                          value={formData.objet}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent"
                        >
                          <option value="">Sélectionnez un objet</option>
                          <option value="achat">Achat d'un bien</option>
                          <option value="location">Location</option>
                          <option value="vente">Vente de mon bien</option>
                          <option value="gestion">Gestion locative</option>
                          <option value="estimation">Estimation gratuite</option>
                          <option value="autre">Autre demande</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent resize-none"
                        placeholder="Décrivez votre projet ou votre question..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-[#0D354E] text-white font-semibold rounded-lg hover:bg-[#0D354E]/90 transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>

                    {submitError && (
                      <p className="text-sm text-red-500 text-center">{submitError}</p>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      En envoyant ce formulaire, vous acceptez que vos données soient utilisées 
                      pour vous recontacter. Voir notre politique de confidentialité.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15928.123456789012!2d${entreprise.coordonnees.lng}!3d${entreprise.coordonnees.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMTUnNDguMiJTIDE1wrAxNCczNC40IkU!5e0!3m2!1sfr!2scg!4v1234567890123!5m2!1sfr!2scg`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation Capital Immo Group"
        />
      </section>
    </main>
  );
}

