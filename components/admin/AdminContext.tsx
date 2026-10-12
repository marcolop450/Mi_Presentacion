"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  defaultSocialLinks,
  defaultCategories,
  defaultRecommendations,
  defaultAuxiliaries,
  defaultSubjects,
  defaultSemesters,
} from "@/lib/data/initialData";
import {
  SocialLink,
  Category,
  Recommendation,
  Auxiliary,
  Subject,
  Semester,
} from "@/types/database";

export const ITEMS_PER_PAGE = 6;

interface AdminContextType {
  // Datos
  semestersList: Semester[];
  setSemestersList: React.Dispatch<React.SetStateAction<Semester[]>>;
  subjectsList: Subject[];
  setSubjectsList: React.Dispatch<React.SetStateAction<Subject[]>>;
  auxiliariesList: Auxiliary[];
  setAuxiliariesList: React.Dispatch<React.SetStateAction<Auxiliary[]>>;
  categoriesList: Category[];
  setCategoriesList: React.Dispatch<React.SetStateAction<Category[]>>;
  recommendationsList: Recommendation[];
  setRecommendationsList: React.Dispatch<React.SetStateAction<Recommendation[]>>;
  socialLinksList: SocialLink[];
  setSocialLinksList: React.Dispatch<React.SetStateAction<SocialLink[]>>;

  // Estados de carga y autenticación
  isLoading: boolean;
  isVerifyingAuth: boolean;
  adminEmail: string;
  notification: string;
  showToast: (msg: string) => void;
  loadAllData: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("marcolop450@gmail.com");
  const [notification, setNotification] = useState("");

  const [semestersList, setSemestersList] = useState<Semester[]>(defaultSemesters);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(defaultSubjects);
  const [auxiliariesList, setAuxiliariesList] = useState<Auxiliary[]>(defaultAuxiliaries);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [recommendationsList, setRecommendationsList] = useState<Recommendation[]>(defaultRecommendations);
  const [socialLinksList, setSocialLinksList] = useState<SocialLink[]>(defaultSocialLinks);

  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  }, []);

  const loadAllData = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    setIsLoading(true);

    try {
      const [semRes, catRes, subRes, auxRes, recRes, socRes] = await Promise.all([
        supabase.from("semesters").select("*").order("display_order", { ascending: true }),
        supabase.from("categories").select("*").order("display_order", { ascending: true }),
        supabase.from("subjects").select("*").order("code", { ascending: true }),
        supabase.from("auxiliaries").select("*, subject:subjects(*), semester:semesters(*)").order("created_at", { ascending: false }),
        supabase.from("recommendations").select("*, category:categories(*)").order("created_at", { ascending: false }),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);

      if (semRes.data) setSemestersList(semRes.data as Semester[]);
      if (catRes.data) setCategoriesList(catRes.data as Category[]);
      if (subRes.data) setSubjectsList(subRes.data as Subject[]);
      if (auxRes.data) setAuxiliariesList(auxRes.data as Auxiliary[]);
      if (recRes.data) setRecommendationsList(recRes.data as Recommendation[]);
      if (socRes.data) setSocialLinksList(socRes.data as SocialLink[]);
    } catch {
      showToast("Problemas de Servidor al sincronizar datos.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Verificación de sesión al montar
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      if (!supabase) {
        router.replace("/admin/login");
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          router.replace("/admin/login");
          return;
        }

        if (session.user?.email) {
          setAdminEmail(session.user.email);
        }
        setIsVerifyingAuth(false);
        loadAllData();
      } catch {
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router, loadAllData]);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  return (
    <AdminContext.Provider
      value={{
        semestersList,
        setSemestersList,
        subjectsList,
        setSubjectsList,
        auxiliariesList,
        setAuxiliariesList,
        categoriesList,
        setCategoriesList,
        recommendationsList,
        setRecommendationsList,
        socialLinksList,
        setSocialLinksList,
        isLoading,
        isVerifyingAuth,
        adminEmail,
        notification,
        showToast,
        loadAllData,
        handleLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin debe ser usado dentro de un AdminProvider");
  }
  return context;
}
