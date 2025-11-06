/**
 * Page dynamique pour les ressources
 * Affiche le contenu complet de chaque ressource
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Share2, FileText, BookOpen, Tag } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Données des ressources (même structure que dans page.tsx)
const resources = [
  {
    id: 1,
    title: "Préparer entretien",
    type: "Guide",
    category: "Entretiens",
    description: "Techniques et conseils pour réussir vos entretiens avec des exemples",
    author: "Thomas Martin",
    publishedDate: "2024-01-12",
    format: "Article",
    icon: FileText,
    color: "text-red-600",
    bgColor: "bg-red-100",
    tags: ["Entretien", "Préparation", "Conseils"],
    slug: "preparer-entretien",
    content: {
      sections: [
        {
          title: "Avant l'entretien : Préparation essentielle",
          content: [
            "La préparation est la clé du succès lors d'un entretien d'embauche. Commencez par rechercher en profondeur l'entreprise, ses valeurs, sa culture, et ses récentes actualités. Comprenez le rôle pour lequel vous postulez et comment votre expérience correspond aux exigences.",
            "Préparez des exemples concrets de vos réalisations passées en utilisant la méthode STAR (Situation, Tâche, Action, Résultat). Préparez également des questions pertinentes à poser à votre interlocuteur pour montrer votre intérêt et votre engagement.",
            "Entraînez-vous à répondre aux questions courantes : 'Parlez-moi de vous', 'Pourquoi voulez-vous ce poste ?', 'Quelles sont vos forces et faiblesses ?'. La pratique vous aidera à vous sentir plus confiant et naturel."
          ]
        },
        {
          title: "Pendant l'entretien : Communication efficace",
          content: [
            "Le jour de l'entretien, arrivez 10-15 minutes en avance. Habillez-vous de manière professionnelle et adaptée à la culture de l'entreprise. Maintenez un contact visuel, souriez, et utilisez un langage corporel ouvert et positif.",
            "Écoutez attentivement les questions et prenez votre temps pour répondre. Il vaut mieux faire une courte pause pour réfléchir que de répondre précipitamment. Utilisez vos exemples préparés pour illustrer vos compétences et votre expérience.",
            "Montrez votre enthousiasme pour le poste et l'entreprise. Posez des questions intelligentes qui démontrent votre compréhension du rôle et votre intérêt pour contribuer à l'organisation."
          ]
        },
        {
          title: "Après l'entretien : Suivi professionnel",
          content: [
            "Dans les 24 heures suivant l'entretien, envoyez un email de remerciement personnalisé. Mentionnez des points spécifiques de votre conversation pour montrer votre attention et votre intérêt.",
            "Si vous ne recevez pas de réponse dans les délais indiqués, un suivi poli est acceptable. Restez professionnel et patient tout en continuant à explorer d'autres opportunités.",
            "Profitez de chaque entretien comme une expérience d'apprentissage, même si vous n'obtenez pas le poste. Demandez des retours constructifs pour améliorer vos performances futures."
          ]
        }
      ],
      tips: [
        "Préparez 3-5 questions pertinentes à poser à la fin de l'entretien",
        "Apportez des copies de votre CV et des références",
        "Notez les points clés de la conversation pour le suivi",
        "Prévoyez votre trajet à l'avance pour éviter tout stress"
      ]
    }
  },
  {
    id: 2,
    title: "Networking efficace",
    type: "Article",
    category: "Réseau professionnel",
    description: "Comment développer votre réseau professionnel et créer des opportunités",
    author: "Sophie Leroy",
    publishedDate: "2024-01-10",
    format: "Article",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-100",
    tags: ["Networking", "Réseau", "Opportunités"],
    slug: "networking-efficace",
    content: {
      sections: [
        {
          title: "Les bases du networking professionnel",
          content: [
            "Le networking professionnel est bien plus qu'échanger des cartes de visite. C'est construire des relations authentiques et mutuellement bénéfiques. Commencez par identifier les événements, conférences et groupes pertinents dans votre secteur.",
            "L'approche doit être authentique : intéressez-vous sincèrement aux autres personnes. Posez des questions ouvertes, écoutez activement, et cherchez des façons d'apporter de la valeur à votre réseau.",
            "Utilisez les réseaux sociaux professionnels comme LinkedIn pour maintenir vos contacts. Partagez du contenu pertinent, commentez les publications de votre réseau, et félicitez les succès de vos contacts."
          ]
        },
        {
          title: "Stratégies pour développer votre réseau",
          content: [
            "Participez activement aux événements professionnels : arrivez tôt, restez jusqu'à la fin, et engagez-vous dans des conversations significatives. Évitez de rester dans votre coin ou de ne parler qu'aux personnes que vous connaissez déjà.",
            "Créez votre propre contenu : blog, articles LinkedIn, ou vidéos pour établir votre expertise et attirer des personnes partageant les mêmes intérêts. Le contenu de qualité attire naturellement les bonnes connexions.",
            "Offrez votre aide : le meilleur réseau est celui où vous donnez avant de recevoir. Partagez des opportunités, faites des recommandations, et connectez des personnes qui peuvent bénéficier les unes des autres."
          ]
        },
        {
          title: "Maintenir et faire fructifier votre réseau",
          content: [
            "Un réseau nécessite un entretien régulier. Organisez des cafés ou des appels réguliers avec vos contacts clés. N'attendez pas d'avoir besoin de quelque chose pour contacter votre réseau.",
            "Soyez stratégique : identifiez les personnes influentes dans votre domaine et développez des relations avec elles. Mais n'oubliez pas que chaque personne dans votre réseau a de la valeur, quelle que soit sa position.",
            "Mesurez votre networking : suivez les nouvelles connexions, les opportunités créées, et les collaborations nées de votre réseau. Cela vous aidera à affiner votre approche au fil du temps."
          ]
        }
      ],
      tips: [
        "Suivez vos contacts sur LinkedIn après chaque événement",
        "Créez un système pour suivre vos interactions réseau",
        "Partagez régulièrement du contenu de valeur",
        "Remerciez toujours les personnes qui vous aident"
      ]
    }
  },
  {
    id: 3,
    title: "Négocier son salaire",
    type: "Guide",
    category: "Négociation",
    description: "Stratégies pour négocier efficacement votre rémunération et vos avantages",
    author: "Alexandre Petit",
    publishedDate: "2024-01-08",
    format: "Article",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    tags: ["Négociation", "Salaire", "Avantages"],
    slug: "negocier-salaire",
    content: {
      sections: [
        {
          title: "Préparation à la négociation salariale",
          content: [
            "Avant toute négociation, faites vos recherches. Utilisez des outils comme Glassdoor, PayScale, ou LinkedIn pour connaître les salaires moyens pour votre poste dans votre région et secteur. Documentez vos recherches pour pouvoir les citer.",
            "Évaluez votre valeur : listez vos compétences, expériences, certifications, et réalisations. Quantifiez vos contributions passées (augmentation des ventes, réduction des coûts, projets réussis). Plus vous avez de preuves concrètes, plus votre position est forte.",
            "Déterminez votre fourchette : établissez un salaire minimum acceptable, un salaire cible réaliste, et un salaire idéal. Cette fourchette vous donnera une marge de négociation et vous aidera à prendre des décisions éclairées."
          ]
        },
        {
          title: "Techniques de négociation efficaces",
          content: [
            "Timing : attendez que l'employeur fasse la première offre. Si vous devez donner un chiffre en premier, donnez une fourchette haute basée sur vos recherches. Utilisez des phrases comme 'Basé sur mes recherches et mon expérience, je m'attends à un salaire entre X et Y.'",
            "Négociez le package complet : ne vous concentrez pas uniquement sur le salaire. Les avantages (congés payés, télétravail, formation, bonus, actions) peuvent avoir une valeur significative. Calculez la valeur totale du package.",
            "Restez professionnel et positif : montrez votre enthousiasme pour le poste tout en défendant votre valeur. Utilisez des phrases comme 'Je suis très intéressé par ce poste, et j'aimerais discuter d'une rémunération qui reflète ma valeur.'"
          ]
        },
        {
          title: "Gérer les objections et conclure",
          content: [
            "Si l'employeur refuse votre demande, demandez pourquoi. Comprenez leurs contraintes budgétaires. Proposez des alternatives : salaire de départ plus bas avec révision dans 6 mois, bonus de signature, ou avantages supplémentaires.",
            "N'acceptez pas immédiatement : demandez du temps pour réfléchir, même si l'offre vous semble bonne. Cela vous donne le temps d'évaluer et montre que vous êtes réfléchi dans vos décisions.",
            "Obtenez tout par écrit : une fois que vous avez accepté, demandez une lettre d'offre officielle avec tous les détails (salaire, avantages, date de début, conditions). Vérifiez que tout correspond à ce qui a été discuté."
          ]
        }
      ],
      tips: [
        "Entraînez-vous à négocier avec un ami ou un mentor",
        "Ne révèle jamais votre salaire actuel si possible",
        "Considérez les avantages non financiers (télétravail, flexibilité)",
        "Sachez quand dire non si l'offre est trop éloignée de vos attentes"
      ]
    }
  },
  {
    id: 4,
    title: "Évolution de carrière",
    type: "Article",
    category: "Carrière",
    description: "Planifier et réussir votre évolution professionnelle avec des étapes concrètes",
    author: "Jean Dupont",
    publishedDate: "2024-01-03",
    format: "Article",
    icon: BookOpen,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    tags: ["Carrière", "Évolution", "Planification"],
    slug: "evolution-carriere",
    content: {
      sections: [
        {
          title: "Définir votre vision de carrière",
          content: [
            "L'évolution de carrière commence par une vision claire. Prenez le temps de réfléchir à où vous voulez être dans 5, 10 et 15 ans. Quels sont vos objectifs professionnels ? Quelles compétences souhaitez-vous développer ? Quel impact voulez-vous avoir ?",
            "Effectuez une auto-évaluation honnête : identifiez vos forces, vos faiblesses, vos passions et vos valeurs. Comprenez ce qui vous motive vraiment. Cette introspection vous aidera à faire des choix de carrière alignés avec qui vous êtes.",
            "Recherchez des rôles et des industries qui vous intéressent. Parlez à des professionnels dans ces domaines, suivez des formations, et testez vos intérêts grâce à des projets parallèles ou du bénévolat."
          ]
        },
        {
          title: "Créer un plan d'action concret",
          content: [
            "Décomposez votre vision en objectifs à court, moyen et long terme. Chaque objectif doit être SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini). Par exemple, 'Obtenir une certification dans mon domaine d'ici 6 mois'.",
            "Identifiez les compétences à développer : quelles sont les compétences requises pour atteindre vos objectifs ? Créez un plan de développement incluant des formations, des projets, et des opportunités d'apprentissage sur le terrain.",
            "Construisez votre réseau stratégique : connectez-vous avec des personnes qui ont le poste que vous convoitez ou qui travaillent dans l'industrie cible. Leurs conseils et leurs introductions seront précieux pour votre évolution."
          ]
        },
        {
          title: "Exécuter et ajuster votre plan",
          content: [
            "Agissez de manière cohérente : consacrez du temps chaque semaine à votre développement professionnel. Cela peut inclure des lectures, des formations en ligne, des projets personnels, ou des événements de networking.",
            "Mesurez vos progrès : révisez régulièrement votre plan (par exemple, tous les trimestres). Qu'avez-vous accompli ? Quels obstacles avez-vous rencontrés ? Qu'est-ce qui doit être ajusté ?",
            "Soyez flexible : les opportunités peuvent surgir de manière inattendue. Restez ouvert aux changements de plan tout en gardant votre vision à long terme en tête. Parfois, le chemin le plus direct n'est pas le meilleur."
          ]
        }
      ],
      tips: [
        "Créez un tableau de bord de carrière pour suivre vos objectifs",
        "Trouvez un mentor dans votre domaine cible",
        "Documentez vos réalisations et apprentissages",
        "Célébrez les petites victoires en cours de route"
      ]
    }
  },
  {
    id: 5,
    title: "Guide CV parfait",
    type: "Guide",
    category: "CV & Lettre de motivation",
    description: "Créez un CV qui attire l'attention des recruteurs et maximise vos chances",
    author: "Marie Dubois",
    publishedDate: "2024-01-15",
    format: "Article",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    tags: ["CV", "Recrutement", "Conseils"],
    slug: "guide-cv-parfait",
    content: {
      sections: [
        {
          title: "Structure et format du CV",
          content: [
            "Un CV efficace doit être clair, concis et facile à scanner. Limitez-vous à 2 pages maximum (1 page pour les profils junior). Utilisez une police professionnelle (Arial, Calibri, ou Times New Roman) en taille 10-12 points.",
            "Organisez votre CV en sections claires : Coordonnées, Profil/Résumé, Expérience professionnelle, Formation, Compétences. Utilisez des en-têtes en gras et des puces pour faciliter la lecture.",
            "Adaptez votre CV à chaque candidature : surlignez les expériences et compétences les plus pertinentes pour le poste. Utilisez les mots-clés de l'annonce pour passer les systèmes de filtrage automatique (ATS)."
          ]
        },
        {
          title: "Rédaction efficace de votre expérience",
          content: [
            "Utilisez des verbes d'action puissants : 'Dirigé', 'Développé', 'Optimisé', 'Augmenté', 'Créé'. Évitez les verbes passifs ou faibles comme 'Était responsable de' ou 'A participé à'.",
            "Quantifiez vos réalisations : au lieu de 'Géré une équipe', dites 'Géré une équipe de 8 personnes, augmentant la productivité de 25%'. Les chiffres et les résultats concrets sont beaucoup plus impactants.",
            "Utilisez la méthode CAR (Contexte, Action, Résultat) pour décrire vos expériences. Pour chaque poste, incluez 3-5 bullet points décrivant vos principales réalisations et contributions."
          ]
        },
        {
          title: "Optimisation et vérification",
          content: [
            "Relisez attentivement : les fautes d'orthographe ou de grammaire peuvent disqualifier votre candidature. Utilisez un correcteur orthographique et demandez à quelqu'un de relire votre CV.",
            "Optimisez pour les ATS : utilisez des mots-clés pertinents, évitez les tableaux complexes, les images ou les graphiques, et sauvegardez en format .docx ou .pdf compatible.",
            "Mettez à jour régulièrement : même si vous ne cherchez pas activement, gardez votre CV à jour avec vos dernières expériences et compétences. Cela vous fera gagner du temps quand une opportunité se présente."
          ]
        }
      ],
      tips: [
        "Téléchargez votre CV en PDF pour préserver le formatage",
        "Incluez un lien vers votre profil LinkedIn",
        "Créez plusieurs versions ciblées selon les types de postes",
        "Testez votre CV avec des amis ou des recruteurs"
      ]
    }
  },
  {
    id: 6,
    title: "Optimiser profil",
    type: "Guide",
    category: "Réseau professionnel",
    description: "Créez un profil professionnel attractif qui attire les recruteurs",
    author: "Sarah Johnson",
    publishedDate: "2024-01-20",
    format: "Article",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    tags: ["Profil", "Optimisation", "Visibilité"],
    slug: "optimiser-profil",
    content: {
      sections: [
        {
          title: "Optimiser votre profil LinkedIn",
          content: [
            "Votre photo de profil doit être professionnelle : costume ou tenue professionnelle, fond neutre, sourire naturel. Évitez les photos de groupe, les selfies, ou les photos de vacances. Investir dans une photo professionnelle est souvent rentable.",
            "Le titre LinkedIn (sous votre nom) est crucial. Au lieu de simplement votre titre actuel, utilisez un titre qui inclut votre valeur et vos compétences clés : 'Développeur Full-Stack | React & Node.js | Expert en architecture scalable'.",
            "Votre résumé doit raconter votre histoire professionnelle de manière engageante. Utilisez la première personne, incluez vos réalisations quantifiées, et terminez par ce que vous recherchez. Ajoutez des mots-clés pertinents pour votre industrie."
          ]
        },
        {
          title: "Maximiser votre visibilité",
          content: [
            "Remplissez tous les champs : expérience complète, formation, certifications, compétences, projets. Un profil complet à 100% est beaucoup plus visible dans les recherches LinkedIn.",
            "Ajoutez des compétences pertinentes et demandez des recommandations. Les compétences validées par vos contacts augmentent votre crédibilité. Les recommandations écrites sont encore plus puissantes.",
            "Partagez du contenu régulièrement : articles, pensées professionnelles, ou commentaires pertinents. Cela vous positionne comme un expert dans votre domaine et augmente votre visibilité dans le feed LinkedIn."
          ]
        },
        {
          title: "Engagement et networking actif",
          content: [
            "Connectez-vous stratégiquement : envoyez des demandes de connexion personnalisées aux personnes pertinentes dans votre secteur. Joignez-vous à des groupes professionnels et participez aux discussions.",
            "Interagissez avec le contenu : likez, commentez et partagez les publications de votre réseau. Cela augmente votre visibilité et montre votre engagement professionnel.",
            "Utilisez les fonctionnalités LinkedIn : publiez des articles, utilisez les stories, créez des posts avec hashtags pertinents. Diversifiez votre contenu pour toucher différents segments de votre réseau."
          ]
        }
      ],
      tips: [
        "Mettez à jour votre profil tous les 3-6 mois",
        "Utilisez des hashtags pertinents dans vos posts (5-10 maximum)",
        "Répondez aux messages dans les 24 heures",
        "Créez du contenu original, pas seulement des partages"
      ]
    }
  }
];

export default function ResourcePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const resource = resources.find(r => r.slug === slug);
  
  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ressource non trouvée</h1>
            <Button onClick={() => router.push('/resources')}>
              Retour aux ressources
            </Button>
          </div>
        </Container>
      </div>
    );
  }
  
  const IconComponent = resource.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link href="/resources" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Retour aux ressources
            </Link>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </Container>
      </div>

      {/* Article Content */}
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 ${resource.bgColor} ${resource.color} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
              <IconComponent className="w-4 h-4" />
              <span>{resource.type}</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {resource.title}
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{resource.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(resource.publishedDate).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{resource.category}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {resource.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {resource.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-12 text-foreground">
              {resource.content?.sections.map((section, index) => (
                <div key={index} className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground border-b border-border pb-3">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-lg leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Tips Section */}
              {resource.content?.tips && (
                <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-6 text-foreground">
                    💡 Conseils pratiques
                  </h3>
                  <ul className="space-y-3">
                    {resource.content.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span className="text-lg text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

