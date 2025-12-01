/**
 * Client API centralisé pour LinkUp
 * Gère toutes les requêtes vers le backend
 * 
 * GESTION DES TOKENS :
 * - Les tokens sont stockés dans des cookies httpOnly par le backend
 * - Le frontend ne stocke JAMAIS le token (pas de js-cookie, pas de localStorage)
 * - Les cookies sont automatiquement envoyés avec credentials: 'include'
 */

import logger from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string[]; // Détails de validation (ex: erreurs de mot de passe)
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ApiClient {
  private baseURL: string;
  private csrfToken: string | null = null; // Stocker le token en mémoire

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Sanitize une URL pour les logs (masque les paramètres sensibles)
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Masquer les paramètres de requête qui pourraient contenir des données sensibles
      const params = urlObj.searchParams;
      const sanitizedParams = new URLSearchParams();
      
      // Ne garder que les paramètres non sensibles
      params.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        // Masquer les paramètres potentiellement sensibles
        if (lowerKey.includes('token') || lowerKey.includes('password') || lowerKey.includes('secret') || lowerKey.includes('key')) {
          sanitizedParams.append(key, '***');
        } else {
          sanitizedParams.append(key, value);
        }
      });
      
      urlObj.search = sanitizedParams.toString();
      return urlObj.toString();
    } catch {
      // Si l'URL n'est pas valide, retourner une version masquée
      return url.split('?')[0] + '?***';
    }
  }

  /**
   * Sanitize les données d'erreur pour les logs (masque les données sensibles)
   */
  private sanitizeErrorData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sanitized: any = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'email', 'phone', 'address', 'credit_card', 'ssn'];
    
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '***';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeErrorData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Récupérer le token CSRF depuis le stockage en mémoire
   * Le token est stocké après avoir été récupéré depuis le header de réponse
   */
  private getCsrfToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Récupérer le token CSRF depuis le backend
   * Fait une requête GET pour obtenir le token dans le header de réponse
   */
  private async fetchCsrfToken(): Promise<string | null> {
    try {
      logger.debug('[CSRF] Récupération du token CSRF depuis le backend...');
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const token = response.headers.get('X-CSRF-Token');
      if (token) {
        this.csrfToken = token;
        logger.debug('[CSRF] Token CSRF récupéré et stocké en mémoire');
        return token;
      }
      
      logger.warn('[CSRF] Token CSRF non trouvé dans le header de réponse');
      return null;
    } catch (error) {
      logger.error('[CSRF] Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  /**
   * Fonction utilitaire pour récupérer le token depuis les cookies httpOnly
   * Note: Les cookies httpOnly ne sont pas accessibles par JavaScript
   * Cette fonction est utilisée uniquement pour vérifier la présence du token
   * Le token est automatiquement envoyé par le navigateur avec credentials: 'include'
   */
  private getTokenFromCookie(): string | null {
    // Les cookies httpOnly ne sont pas accessibles par JavaScript
    // On vérifie simplement si le cookie existe dans document.cookie
    // (mais on ne peut pas lire sa valeur si httpOnly)
    if (typeof document === 'undefined') return null;
    return document.cookie.includes('linkup_token=') ? 'present' : null;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Déterminer si c'est un upload de fichier (FormData)
    const isFormData = options.body instanceof FormData;
    
    // Déterminer si c'est une requête mutante nécessitant un token CSRF
    const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    const method = options.method || 'GET';
    const isMutating = mutatingMethods.includes(method);
    
    // Récupérer le token CSRF pour les requêtes mutantes
    let csrfToken = isMutating ? this.getCsrfToken() : null;
    
    // Si c'est une requête mutante et qu'on n'a pas de token, le récupérer depuis le backend
    if (isMutating && !csrfToken) {
      csrfToken = await this.fetchCsrfToken();
    }
    
    const config: RequestInit = {
      credentials: 'include', // CRITIQUE: Inclure les cookies httpOnly automatiquement
      headers: {
        // Ne pas définir Content-Type pour FormData, laisser le navigateur le faire
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        // Ajouter le token CSRF pour les requêtes mutantes
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Récupérer le token CSRF depuis le header de réponse si disponible
      // Le backend envoie le token dans le header X-CSRF-Token à chaque requête
      // Mettre à jour le token en mémoire pour les prochaines requêtes
      const responseCsrfToken = response.headers.get('X-CSRF-Token');
      if (responseCsrfToken) {
        this.csrfToken = responseCsrfToken;
        logger.debug('[CSRF] Token CSRF mis à jour depuis le header de réponse');
      }
      
      // Vérifier le Content-Type avant de parser
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        logger.error(`[API Error] Non-JSON response from ${url}:`, text);
        
        // Vérifier si c'est une erreur de connexion
        if (response.status === 0 || text.includes('ERR_CONNECTION_REFUSED') || text.includes('ECONNREFUSED')) {
          throw new Error(`Impossible de se connecter au backend sur ${this.baseURL}. Vérifiez que le serveur est démarré avec 'npm run dev' dans le dossier backend.`);
        }
        
        throw new Error(`Le serveur a retourné du HTML au lieu de JSON. Vérifiez que le backend est démarré sur ${this.baseURL}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        // Ne pas logger les erreurs 401/404 pour les endpoints de vérification d'authentification
        // car c'est un comportement attendu (on essaie /users/me et /companies/me pour déterminer le type)
        const isAuthCheckEndpoint = url.includes('/users/me') || url.includes('/companies/me');
        const isAuthError = response.status === 401 || response.status === 404;
        
        if (!isAuthCheckEndpoint || !isAuthError) {
          // Logger uniquement les erreurs non liées à l'authentification
          // Sanitizer l'URL et les données avant de logger
          const sanitizedUrl = this.sanitizeUrl(url);
          const sanitizedData = this.sanitizeErrorData(data);
          
          if (response.status >= 500) {
            logger.error(`[API Error] ${response.status} from ${sanitizedUrl}:`, sanitizedData);
          } else if (response.status >= 400) {
            logger.warn(`[API Warning] ${response.status} from ${sanitizedUrl}:`, sanitizedData);
          }
        }
        
        // Si c'est une erreur CSRF, essayer de récupérer le token et réessayer une fois
        if (response.status === 403 && data.error && data.error.includes('CSRF')) {
          logger.warn('[CSRF] Erreur CSRF détectée, tentative de récupération du token...');
          
          // Récupérer le token depuis le header de réponse
          const responseCsrfToken = response.headers.get('X-CSRF-Token');
          if (responseCsrfToken && typeof document !== 'undefined') {
            const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
            const sameSite = isProduction ? 'Strict' : 'Lax';
            const secure = isProduction ? '; Secure' : '';
            document.cookie = `csrf_token=${responseCsrfToken}; path=/; max-age=${24 * 60 * 60}; SameSite=${sameSite}${secure}`;
            
            // Réessayer la requête avec le nouveau token
            const retryConfig: RequestInit = {
              ...config,
              headers: {
                ...config.headers,
                'X-CSRF-Token': responseCsrfToken,
              },
            };
            
            try {
              const retryResponse = await fetch(url, retryConfig);
              const retryData = await retryResponse.json();
              
              if (retryResponse.ok) {
                logger.debug('[CSRF] Requête réussie après récupération du token');
                return {
                  success: true,
                  data: retryData.data || retryData,
                };
              }
            } catch (retryError) {
              logger.error('[CSRF] Erreur lors de la nouvelle tentative:', retryError);
            }
          }
        }
        
        // Si c'est une erreur CSRF (403), récupérer le token depuis le header et réessayer
        if (response.status === 403 && data.error && (data.error.includes('CSRF') || data.error.includes('csrf'))) {
          logger.warn('[CSRF] Erreur CSRF détectée, récupération du token depuis le header...');
          
          // Récupérer le token depuis le header de réponse
          const responseCsrfToken = response.headers.get('X-CSRF-Token');
          if (responseCsrfToken) {
            // Mettre à jour le token en mémoire
            this.csrfToken = responseCsrfToken;
            
            // Réessayer la requête avec le nouveau token
            const retryConfig: RequestInit = {
              ...config,
              headers: {
                ...config.headers,
                'X-CSRF-Token': responseCsrfToken,
              },
            };
            
            try {
              logger.debug('[CSRF] Nouvelle tentative avec le token récupéré...');
              const retryResponse = await fetch(url, retryConfig);
              const retryContentType = retryResponse.headers.get('content-type');
              
              if (retryContentType && retryContentType.includes('application/json')) {
                const retryData = await retryResponse.json();
                
                // Mettre à jour le token depuis la réponse de retry
                const retryCsrfToken = retryResponse.headers.get('X-CSRF-Token');
                if (retryCsrfToken) {
                  this.csrfToken = retryCsrfToken;
                }
                
                if (retryResponse.ok) {
                  logger.debug('[CSRF] Requête réussie après récupération du token');
                  return {
                    success: true,
                    data: retryData.data || retryData,
                  };
                }
              }
            } catch (retryError) {
              logger.error('[CSRF] Erreur lors de la nouvelle tentative:', retryError);
            }
          } else {
            // Si pas de token dans le header, essayer de le récupérer depuis le backend
            const fetchedToken = await this.fetchCsrfToken();
            if (fetchedToken) {
              // Réessayer avec le token récupéré
              const retryConfig: RequestInit = {
                ...config,
                headers: {
                  ...config.headers,
                  'X-CSRF-Token': fetchedToken,
                },
              };
              
              try {
                logger.debug('[CSRF] Nouvelle tentative avec le token récupéré depuis le backend...');
                const retryResponse = await fetch(url, retryConfig);
                const retryContentType = retryResponse.headers.get('content-type');
                
                if (retryContentType && retryContentType.includes('application/json')) {
                  const retryData = await retryResponse.json();
                  
                  // Mettre à jour le token depuis la réponse
                  const retryCsrfToken = retryResponse.headers.get('X-CSRF-Token');
                  if (retryCsrfToken) {
                    this.csrfToken = retryCsrfToken;
                  }
                  
                  if (retryResponse.ok) {
                    logger.debug('[CSRF] Requête réussie après récupération du token');
                    return {
                      success: true,
                      data: retryData.data || retryData,
                    };
                  }
                }
              } catch (retryError) {
                logger.error('[CSRF] Erreur lors de la nouvelle tentative:', retryError);
              }
            }
          }
        }
        
        // Retourner directement les détails d'erreur au lieu de throw
        // Ne pas exposer les messages d'erreur techniques en production
        const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
        const errorMessage = isProduction
          ? (response.status >= 500 ? 'Erreur serveur' : 'Une erreur est survenue')
          : (data.error || data.message || `HTTP error! status: ${response.status}`);
        
        return {
          success: false,
          error: errorMessage,
          details: data.details || [], // Inclure les détails de validation
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      const sanitizedUrl = this.sanitizeUrl(url);
      logger.error(`[API Error] Request failed for ${sanitizedUrl}:`, error);
      // Ne pas exposer le message d'erreur exact en production
      const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
      const errorMessage = isProduction
        ? 'Une erreur est survenue'
        : (error instanceof Error ? error.message : 'Une erreur est survenue');
      
      return {
        success: false,
        error: errorMessage,
        details: [],
      };
    }
  }

  /**
   * Vérifie si un token est présent (via les cookies httpOnly)
   * Note: On ne peut pas lire la valeur du token car il est httpOnly
   * On vérifie simplement sa présence
   */
  isAuthenticated(): boolean {
    return this.getTokenFromCookie() !== null;
  }

  /**
   * Déconnexion: Le backend gère la suppression du cookie httpOnly
   * Cette fonction appelle simplement l'endpoint logout
   */
  async logout(): Promise<void> {
    logger.debug('🔴 [API] Appel logout utilisateur');
    const response = await this.request('/auth/users/logout', {
      method: 'POST',
    });
    logger.debug('🔴 [API] Réponse logout:', { success: response.success });
    // Le cookie httpOnly sera supprimé par le backend via clearCookie()
  }

  /**
   * Tester la connectivité du backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      logger.error('Backend non accessible:', error);
      return false;
    }
  }

  // Auth - Users
  async signupUser(userData: {
    email: string;
    password: string;
    phone: string;
    firstname: string;
    lastname: string;
    bio_pro?: string;
    city?: string;
    country?: string;
  }) {
    return this.request('/auth/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: { email: string; password: string }) {
    // Le backend définit automatiquement le cookie httpOnly 'linkup_token'
    // Le token est aussi retourné dans la réponse mais n'est pas stocké côté frontend
    // Le navigateur gère automatiquement le cookie httpOnly
    const response = await this.request('/auth/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Le cookie httpOnly est automatiquement défini par le backend
    // Pas besoin de le stocker manuellement côté frontend
    return response;
  }

  // Auth - Companies
  async signupCompany(companyData: {
    name: string;
    description: string;
    industry?: string | null;
    password: string;
    recruiter_mail: string;
    recruiter_firstname?: string | null;
    recruiter_lastname?: string | null;
    recruiter_phone?: string | null;
    website?: string | null;
    employees_number?: string | null;
    founded_year?: number | null;
  }) {
    return this.request('/auth/companies/signup', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async loginCompany(credentials: { recruiter_mail: string; password: string }) {
    // Le backend définit automatiquement le cookie httpOnly 'linkup_token'
    const response = await this.request('/auth/companies/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Le cookie httpOnly est automatiquement défini par le backend
    return response;
  }

  // Users
  async getCurrentUser() {
    return this.request('/users/me');
  }

  // MODIFICATION FRONTEND: Ajout de la méthode pour mettre à jour le profil utilisateur
  async updateUser(userData: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    bio_pro?: string;      // ← NOUVEAU: Bio professionnelle
    website?: string;      // ← NOUVEAU: Site web personnel
    city?: string;         // ← NOUVEAU: Ville
    country?: string;      // ← NOUVEAU: Pays
  }) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentCompany() {
    // Utiliser la route /companies/me qui est plus appropriée
    return this.request('/companies/me');
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = queryParams.toString() ? `/users?${queryParams}` : '/users';
    return this.request(endpoint);
  }

  // Companies
  /**
   * Récupère la liste des entreprises avec filtres et pagination
   * 
   * AMÉLIORATION : Ajout du support des filtres industry et city
   * 
   * @param params - Paramètres de filtrage et pagination
   * @param params.page - Numéro de page (optionnel)
   * @param params.limit - Nombre d'éléments par page (optionnel)
   * @param params.search - Recherche textuelle sur nom/description (optionnel)
   * @param params.industry - Filtre par secteur d'activité (optionnel)
   * @param params.city - Filtre par ville (optionnel)
   * @returns Promise<ApiResponse> - Réponse avec les entreprises filtrées
   * 
   * Exemples d'utilisation:
   * - getCompanies({ page: 1, limit: 10 })
   * - getCompanies({ search: 'tech', industry: 'IT', city: 'Paris' })
   * - getCompanies({ industry: 'Finance', city: 'Lyon' })
   */
  async getCompanies(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    industry?: string;  // ✅ NOUVEAU : Filtre par secteur
    city?: string;      // ✅ NOUVEAU : Filtre par ville
  }) {
    const queryParams = new URLSearchParams();
    
    // 📊 PARAMÈTRES DE PAGINATION
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // 🔍 PARAMÈTRES DE FILTRAGE
    if (params?.search) queryParams.append('search', params.search);
    if (params?.industry) queryParams.append('industry', params.industry);  // ✅ NOUVEAU
    if (params?.city) queryParams.append('city', params.city);              // ✅ NOUVEAU

    // 🌐 CONSTRUCTION DE L'ENDPOINT
    const endpoint = queryParams.toString() ? `/companies?${queryParams}` : '/companies';
    
    return this.request(endpoint);
  }

  async getCompany(id: number) {
    return this.request(`/companies/${id}`);
  }

  async getTopCompanies(limit: number = 3) {
    return this.request(`/stats/top-companies?limit=${limit}`);
  }

  async createCompany(companyData: {
    name: string;
    description: string;
    industry?: string;
    website?: string;
    city?: string;
    country?: string;
  }) {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateCompany(id: number, companyData: Partial<{
    name: string;
    description: string;
    industry: string;
    website: string;
    city: string;
    country: string;
  }>) {
    return this.request(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async uploadCompanyLogo(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request(`/companies/${id}/logo`, {
      method: 'POST',
      body: formData,
    });
  }

  // Jobs
  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    industry?: string;
    contract_type?: string;
    company?: string;
    minSalary?: string;
    experience?: string;
    workMode?: string;
    education?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('q', params.search);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.industry) queryParams.append('industry', params.industry);
    if (params?.contract_type) queryParams.append('contract_type', params.contract_type);
    if (params?.company) queryParams.append('company', params.company);
    if (params?.minSalary) queryParams.append('minSalary', params.minSalary);
    if (params?.experience) queryParams.append('experience', params.experience);
    if (params?.workMode) queryParams.append('workMode', params.workMode);
    if (params?.education) queryParams.append('education', params.education);

    const endpoint = queryParams.toString() ? `/jobs?${queryParams}` : '/jobs';
    return this.request(endpoint);
  }

  async getJob(jobId: number) {
    return this.request(`/jobs/${jobId}`);
  }

  // Jobs CRUD
  async createJob(jobData: {
    title: string;
    description: string;
    location?: string;
    contract_type?: string;
    salary_min?: number;
    salary_max?: number;
    remote?: boolean;
    experience?: string;
    industry?: string;
    contract_duration?: string;
    working_time?: string;
    formation_required?: string;
    id_company?: number;
  }) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId: number, jobData: Partial<{
    title: string;
    description: string;
    location: string;
    contract_type: string;
    salary_min: number;
    salary_max: number;
    remote: boolean;
    experience: string;
    industry: string;
    contract_duration: string;
    working_time: string;
    formation_required: string;
  }>) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId: number) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Applications
  async applyToJob(jobId: number) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ id_job_offer: jobId }),
    });
  }

  async getMyApplications() {
    return this.request('/applications/my');
  }

  async getCompanyApplications(companyId: number, filters?: { status?: string; jobId?: number }) {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.jobId) queryParams.append('jobId', filters.jobId.toString());
    
    const queryString = queryParams.toString();
    const url = `/applications/company/${companyId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url);
  }

  // getJobApplications supprimé car inutilisé

  async updateApplicationStatus(jobId: number, status: string, additionalData?: any) {
    return this.request(`/applications/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...additionalData }),
    });
  }

  async updateApplicationStatusByCompany(jobId: number, status: string, additionalData?: any) {
    return this.request(`/applications/${jobId}/status/company`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...additionalData }),
    });
  }

  // Nouvelles méthodes pour les actions my-applications
  async withdrawApplication(jobId: number) {
    return this.updateApplicationStatus(jobId, 'withdrawn');
  }

  async archiveApplication(jobId: number, isArchived: boolean = true) {
    // L'archivage ne change pas le statut, seulement le flag is_archived
    // On utilise une requête directe pour ne pas modifier le statut
    return this.request(`/applications/${jobId}/archive`, {
      method: 'PUT',
      body: JSON.stringify({ is_archived: isArchived }),
    });
  }

  async requestApplicationFeedback(jobId: number) {
    return this.request(`/applications/${jobId}/feedback-request`, {
      method: 'POST',
    });
  }

  async toggleApplicationBookmark(jobId: number, isBookmarked: boolean) {
    return this.request(`/applications/${jobId}/bookmark`, {
      method: 'PUT',
      body: JSON.stringify({ is_bookmarked: isBookmarked }),
    });
  }

  // Méthodes pour la gestion des documents
  async getApplicationDocuments(jobId: number) {
    return this.request(`/application-documents/${jobId}`);
  }

  async addApplicationDocument(jobId: number, documentType: string, fileName: string, fileUrl: string) {
    return this.request(`/application-documents/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({
        document_type: documentType,
        file_name: fileName,
        file_url: fileUrl
      }),
    });
  }

  async deleteApplicationDocument(documentId: number) {
    return this.request(`/application-documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  async deleteApplication(jobId: number) {
    return this.request(`/applications/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getApplicationStats() {
    return this.request('/applications/stats');
  }

  // Messages
  async sendMessage(messageData: {
    id_receiver: number;
    content: string;
  }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getConversations() {
    return this.request('/messages/conversations');
  }

  async getMessagesWithUser(userId: number) {
    return this.request(`/messages/${userId}`);
  }

  async markMessageAsRead(messageId: number) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  async deleteMessage(messageId: number) {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Saved Jobs
  async getSavedJobs() {
    return this.request('/saved-jobs');
  }

  async saveJob(jobId: number) {
    return this.request('/saved-jobs', {
      method: 'POST',
      body: JSON.stringify({ id_job_offer: jobId }),
    });
  }

  async unsaveJob(jobId: number) {
    return this.request(`/saved-jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // User Files
  async uploadFile(file: File, fileType: 'pdf' | 'photo' | 'cv' | 'cover_letter') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    // Le cookie httpOnly est automatiquement envoyé avec credentials: 'include'
    return this.request('/user-files/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async getMyFiles() {
    return this.request('/user-files/me');
  }

  async deleteFile(fileId: number) {
    return this.request(`/user-files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // MODIFICATION FRONTEND: Supprimer spécifiquement la photo de profil
  async deleteProfilePicture() {
    return this.request('/user-files/profile-picture', {
      method: 'DELETE',
    });
  }

  // Admin
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async banUser(userId: number, reason: string, duration: string) {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason, duration }),
    });
  }

  async banCompany(companyId: number, reason: string, duration: string) {
    return this.request(`/admin/companies/${companyId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason, duration }),
    });
  }

  // ===== STATISTIQUES ENTREPRISE =====

  /**
   * Récupère les statistiques complètes du dashboard entreprise
   */
  async getCompanyDashboardStats() {
    return this.request('/company-stats/dashboard');
  }

  /**
   * Récupère les statistiques des offres d'emploi de l'entreprise
   */
  async getCompanyJobsStats() {
    return this.request('/company-stats/jobs');
  }

  /**
   * Récupère les statistiques des candidatures de l'entreprise
   */
  async getCompanyApplicationsStats() {
    return this.request('/company-stats/applications');
  }

  /**
   * Récupère les statistiques des entretiens de l'entreprise
   */
  async getCompanyInterviewsStats() {
    return this.request('/company-stats/interviews');
  }

  /**
   * Récupère les statistiques des embauches de l'entreprise
   */
  async getCompanyHiredStats() {
    return this.request('/company-stats/hired');
  }

  /**
   * Récupère les candidatures récentes de l'entreprise
   */
  async getCompanyRecentApplications() {
    return this.request('/company-stats/recent-applications');
  }

  /**
   * Récupère les offres actives de l'entreprise
   */
  async getCompanyActiveJobs() {
    return this.request('/company-stats/active-jobs');
  }

  /**
   * Récupère les entretiens à venir de l'entreprise
   */
  async getCompanyUpcomingInterviews() {
    return this.request('/company-stats/upcoming-interviews');
  }

  /**
   * Récupère toutes les offres d'emploi de l'entreprise (pour le dashboard - limité)
   */
  async getCompanyAllJobs() {
    return this.request('/company-stats/all-jobs');
  }

  /**
   * Récupère toutes les offres d'emploi de l'entreprise pour la page de gestion
   */
  async getCompanyAllJobsManagement() {
    return this.request('/company-stats/all-jobs-management');
  }

  // Logout (déjà défini plus haut, on garde celui-ci pour la cohérence)
  async logoutUser() {
    // Le backend supprime automatiquement le cookie httpOnly via clearCookie()
    await this.request('/auth/users/logout', {
      method: 'POST',
    });
  }

  async logoutCompany() {
    logger.debug('🔴 [API] Appel logout entreprise');
    const response = await this.request('/auth/companies/logout', {
      method: 'POST',
    });
    logger.debug('🔴 [API] Réponse logout entreprise:', { success: response.success });
    return response;
  }

  // Mot de passe oublié
  async forgotPassword(email: string) {
    return this.request('/forgotten-password/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/forgotten-password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Vérification du mot de passe actuel (pour les paramètres)
  async verifyCurrentPassword(currentPassword: string) {
    return this.request('/reset-password/verify', {
      method: 'POST',
      body: JSON.stringify({ currentPassword }),
    });
  }

  // Mise à jour du mot de passe (pour les paramètres)
  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request('/reset-password/update', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // ========================================
  // MÉTHODES ADMIN
  // ========================================

  // Statistiques admin
  async getAdminStats() {
    return this.request('/admin/stats/dashboard');
  }

  async getAdminActivity() {
    return this.request('/admin/stats/activity');
  }

  // Gestion des utilisateurs
  async getAdminUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = queryParams.toString() ? `/admin/users?${queryParams}` : '/admin/users';
    return this.request(endpoint);
  }

  async createAdminUser(userData: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateAdminUser(userId: number, userData: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteAdminUser(userId: number) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async changeUserPassword(userId: number, newPassword: string) {
    return this.request(`/admin/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  }

  // Gestion des entreprises
  async getAdminCompanies(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = queryParams.toString() ? `/admin/companies?${queryParams}` : '/admin/companies';
    return this.request(endpoint);
  }

  async createAdminCompany(companyData: any) {
    return this.request('/admin/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateAdminCompany(companyId: number, companyData: any) {
    return this.request(`/admin/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async deleteAdminCompany(companyId: number) {
    return this.request(`/admin/companies/${companyId}`, {
      method: 'DELETE',
    });
  }

  // Gestion des offres d'emploi
  async getAdminJobs(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = queryParams.toString() ? `/admin/jobs?${queryParams}` : '/admin/jobs';
    return this.request(endpoint);
  }

  async createAdminJob(jobData: any) {
    return this.request('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateAdminJob(jobId: number, jobData: any) {
    return this.request(`/admin/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteAdminJob(jobId: number) {
    return this.request(`/admin/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // ========================================
  // MÉTHODES PUBLIQUES POUR LES HOOKS
  // ========================================
  
  /**
   * Méthode publique pour effectuer des requêtes API depuis les hooks
   * Utilisée par useApi et autres hooks personnalisés
   */
  async publicRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, options);
  }

  // Gestion des candidatures
  async getAdminApplications(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = queryParams.toString() ? `/admin/applications?${queryParams}` : '/admin/applications';
    return this.request(endpoint);
  }

  async updateAdminApplication(applicationId: string, applicationData: any) {
    return this.request(`/admin/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  }

  async deleteAdminApplication(applicationId: string) {
    return this.request(`/admin/applications/${applicationId}`, {
      method: 'DELETE',
    });
  }
}

// Instance singleton
export const apiClient = new ApiClient(API_BASE_URL);

// Types pour les réponses API
export interface User {
  id_user: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  bio_pro?: string;
  city?: string;
  website?: string;
  country?: string;
  connexion_index?: number;
  profile_views?: number;
  applies_index?: number;
  private_visibility: boolean;
  created_at: string;
  role: string;
}

export interface Company {
  id_company: number;
  name: string;
  description: string;
  website?: string;
  created_at: string;
  industry?: string;
  employees_number?: string;
  recruiter_firstname?: string;
  recruiter_phone?: string;
  recruiter_mail?: string;
  recruiter_lastname?: string;
  city?: string;
  zip_code?: string;
  country?: string;
}

export interface JobOffer {
  id_job_offer: number;
  title: string;
  description: string;
  location: string;
  contract_type: string;
  published_at: string;
  salary_min?: number;
  salary_max?: number;
  salary?: number;
  remote?: string;
  experience?: string;
  industry?: string;
  contract_duration?: string;
  working_time?: string;
  formation_required?: string;
  id_company: number;
  company?: Company;
}

export interface Application {
  id_user: number;
  id_job_offer: number;
  application_date: string;
  status: string;
  user?: User;
  job_offer?: JobOffer;
}

export interface Message {
  id_message: number;
  content: string;
  send_at: string;
  id_receiver: number;
  id_sender: number;
  sender?: User;
  receiver?: User;
}

export interface UserFile {
  id_user_files: number;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  id_user: number;
}

export interface SavedJob {
  id_user: number;
  id_job_offer: number;
  saved_at: string;
  job_offer?: JobOffer;
}
