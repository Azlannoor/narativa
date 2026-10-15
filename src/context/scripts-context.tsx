import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  listScripts as listScriptsAction,
  createScript as createScriptAction,
  updateScript as updateScriptAction,
  deleteScript as deleteScriptAction,
  duplicateScript as duplicateScriptAction,
  markScriptFinal as markScriptFinalAction,
} from "@/src/actions/scripts";
import { toast } from "@/src/components/ui/sonner";

export interface ScriptSectionItem {
  id: string;
  key: string;
  label: string;
  content: string;
  brollIds: string[];
  estimatedSec: number;
  wordCount?: number;
  timeRangeLabel?: string;
}

export interface FullScript {
  id: string;
  title: string;
  platform: "instagram_reels" | "tiktok" | "facebook_reels" | "facebook_post";
  pillar: "edukasi" | "inspirasi" | "promosi" | "bts_personal";
  salesStyle: "hard_selling" | "soft_selling" | "storyteller";
  status: "draft" | "final" | "arsip";
  targetAudience: string;
  keyMessage: string;
  hookText: string;
  interruptNote: string;
  ctaText: string;
  ctaKeyword?: string;
  sections: ScriptSectionItem[];
  estimatedDurationSec: number;
  wordCount: number;
  updatedAt: string;
}

const LOCAL_STORAGE_SCRIPTS_KEY = "narativa_scripts_cache_v3";

const INITIAL_SCRIPTS: FullScript[] = [];

interface DailyQuotaInfo {
  used: number;
  limit: number;
  remaining: number;
}

interface ScriptsContextType {
  scripts: FullScript[];
  dailyQuota: DailyQuotaInfo;
  isLoading: boolean;
  refreshScripts: () => Promise<void>;
  clearAllScripts: () => Promise<void>;
  addScript: (script: Omit<FullScript, "id" | "updatedAt">) => Promise<string>;
  updateScript: (id: string, updates: Partial<FullScript>) => Promise<void>;
  deleteScript: (id: string) => Promise<void>;
  duplicateScript: (id: string) => Promise<string>;
  markScriptFinal: (id: string) => Promise<void>;
  getScript: (id: string) => FullScript | undefined;
}

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

export function ScriptsProvider({ children }: { children: React.ReactNode }) {
  const [scripts, setScripts] = useState<FullScript[]>(() => {
    if (typeof window !== "undefined") {
      try {
        // Also cleanup legacy v2 cache containing dummy scripts
        localStorage.removeItem("narativa_scripts_cache_v2");
        const saved = localStorage.getItem(LOCAL_STORAGE_SCRIPTS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter out any legacy dummy script IDs
            return parsed.filter(
              (s: any) =>
                !s.id?.startsWith("sc-0") &&
                !s.id?.startsWith("00000000-0000-0000-0000-00000000001")
            );
          }
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SCRIPTS;
  });

  const [dailyQuota, setDailyQuota] = useState<DailyQuotaInfo>({
    used: 0,
    limit: 20,
    remaining: 20,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_SCRIPTS_KEY, JSON.stringify(scripts));
      } catch (err) {
        // localStorage full or restricted
      }
    }
  }, [scripts]);

  // Load scripts from Drizzle database on mount via listScripts action
  const refreshScripts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listScriptsAction({ limit: 50 });
      if (result && result.success && Array.isArray(result.scripts)) {
        // Filter out any legacy dummy scripts
        const cleanScripts = result.scripts.filter(
          (dbItem: any) =>
            !dbItem.id?.startsWith("sc-0") &&
            !dbItem.id?.startsWith("00000000-0000-0000-0000-00000000001")
        );

        // Map database records to FullScript interface
        const mappedScripts: FullScript[] = cleanScripts.map((dbItem: any) => ({
          id: dbItem.id,
          title: dbItem.title,
          platform: dbItem.platform,
          pillar: dbItem.pillar,
          salesStyle: dbItem.salesStyle,
          status: dbItem.status,
          targetAudience: dbItem.targetAudience || "",
          keyMessage: dbItem.keyMessage || "",
          hookText: dbItem.hookText || "",
          interruptNote: dbItem.interruptNote || "Interupsi visual 1-3 detik.",
          ctaText: dbItem.ctaText || "",
          ctaKeyword: dbItem.ctaKeyword || undefined,
          sections: Array.isArray(dbItem.sections)
            ? dbItem.sections.map((s: any, idx: number) => ({
                id: s.id || `sec-${idx + 1}`,
                key: s.key || `step_${idx + 1}`,
                label: s.label || `Bagian ${idx + 1}`,
                content: s.content || "",
                brollIds: Array.isArray(s.brollIds) ? s.brollIds : [],
                estimatedSec: s.estimatedSec || Math.round((s.content?.split(/\s+/).length || 10) / 2.5),
                wordCount: s.wordCount || (s.content ? s.content.split(/\s+/).length : 0),
              }))
            : [],
          estimatedDurationSec: dbItem.estimatedDurationSec || 30,
          wordCount: dbItem.wordCount || 80,
          updatedAt: dbItem.updatedAt
            ? new Date(dbItem.updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Baru saja",
        }));

        setScripts(mappedScripts);
        setDailyQuota({
          used: mappedScripts.length,
          limit: 20,
          remaining: Math.max(0, 20 - mappedScripts.length),
        });
      }
    } catch (err) {
      console.warn("⚠️ Mengambil skrip dari Server Action listScripts menggunakan fallback lokal:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshScripts();
  }, [refreshScripts]);

  const addScript = async (
    scriptData: Omit<FullScript, "id" | "updatedAt">
  ): Promise<string> => {
    const tempId = `sc-${Date.now().toString(36)}`;
    const newScript: FullScript = {
      ...scriptData,
      id: tempId,
      updatedAt: "Baru saja",
    };

    // 1. Optimistic local state update
    setScripts((prev) => [newScript, ...prev]);
    setDailyQuota((prev) => ({
      ...prev,
      used: Math.min(prev.limit, prev.used + 1),
      remaining: Math.max(0, prev.remaining - 1),
    }));

    // 2. Call Server Action to persist to Neon PostgreSQL
    try {
      const result = await createScriptAction({
        title: scriptData.title,
        platform: scriptData.platform,
        pillar: scriptData.pillar,
        salesStyle: scriptData.salesStyle,
        status: scriptData.status,
        targetAudience: scriptData.targetAudience,
        keyMessage: scriptData.keyMessage,
        hookText: scriptData.hookText,
        interruptNote: scriptData.interruptNote,
        ctaText: scriptData.ctaText,
        ctaKeyword: scriptData.ctaKeyword,
        sections: scriptData.sections.map((sec) => ({
          id: sec.id,
          key: sec.key,
          label: sec.label,
          content: sec.content,
          brollIds: sec.brollIds,
          estimatedSec: sec.estimatedSec,
        })),
        estimatedDurationSec: scriptData.estimatedDurationSec,
        wordCount: scriptData.wordCount,
      });

      if (result && result.success && result.script?.id) {
        const serverId = result.script.id;
        setScripts((prev) =>
          prev.map((s) => (s.id === tempId ? { ...s, id: serverId } : s))
        );
        return serverId;
      }
    } catch (err: any) {
      console.warn("⚠️ Server Action createScript fallback:", err);
    }

    return tempId;
  };

  const updateScript = async (
    id: string,
    updates: Partial<FullScript>
  ): Promise<void> => {
    // 1. Optimistic update
    setScripts((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updates,
              updatedAt: "Baru saja",
            }
          : s
      )
    );

    // 2. Call Server Action
    try {
      await updateScriptAction({
        id,
        title: updates.title,
        platform: updates.platform,
        pillar: updates.pillar,
        salesStyle: updates.salesStyle,
        status: updates.status,
        targetAudience: updates.targetAudience,
        keyMessage: updates.keyMessage,
        hookText: updates.hookText,
        interruptNote: updates.interruptNote,
        ctaText: updates.ctaText,
        ctaKeyword: updates.ctaKeyword,
        sections: updates.sections?.map((s) => ({
          id: s.id,
          key: s.key,
          label: s.label,
          content: s.content,
          brollIds: s.brollIds,
          estimatedSec: s.estimatedSec,
        })),
        estimatedDurationSec: updates.estimatedDurationSec,
        wordCount: updates.wordCount,
      });
    } catch (err) {
      console.warn("⚠️ Server Action updateScript fallback:", err);
    }
  };

  const deleteScript = async (id: string): Promise<void> => {
    // 1. Optimistic delete
    setScripts((prev) => prev.filter((s) => s.id !== id));

    // 2. Call Server Action
    try {
      await deleteScriptAction({ id });
    } catch (err) {
      console.warn("⚠️ Server Action deleteScript fallback:", err);
    }
  };

  const duplicateScript = async (id: string): Promise<string> => {
    const original = scripts.find((s) => s.id === id);
    if (!original) return "";

    const tempId = `sc-${Date.now().toString(36)}`;
    const duplicate: FullScript = {
      ...original,
      id: tempId,
      title: `${original.title} (Salinan)`,
      status: "draft",
      updatedAt: "Baru saja",
    };

    // 1. Optimistic duplicate
    setScripts((prev) => [duplicate, ...prev]);

    // 2. Call Server Action
    try {
      const result = await duplicateScriptAction({ id });
      if (result && result.success && result.script?.id) {
        const serverId = result.script.id;
        setScripts((prev) =>
          prev.map((s) => (s.id === tempId ? { ...s, id: serverId } : s))
        );
        return serverId;
      }
    } catch (err) {
      console.warn("⚠️ Server Action duplicateScript fallback:", err);
    }

    return tempId;
  };

  const markScriptFinal = async (id: string): Promise<void> => {
    setScripts((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "final", updatedAt: "Baru saja" } : s
      )
    );

    try {
      await markScriptFinalAction({ id });
    } catch (err) {
      console.warn("⚠️ Server Action markScriptFinal fallback:", err);
    }
  };

  const clearAllScripts = async (): Promise<void> => {
    // 1. Clear local memory and storage
    setScripts([]);
    setDailyQuota({
      used: 0,
      limit: 20,
      remaining: 20,
    });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LOCAL_STORAGE_SCRIPTS_KEY);
        localStorage.removeItem("narativa_scripts_cache_v2");
        localStorage.removeItem("narativa_wizard_active_draft");
        localStorage.removeItem("narativa_offline_scripts");
      } catch (e) {}
    }

    // 2. Clear backend scripts for this user
    try {
      const result = await listScriptsAction({ limit: 100 });
      if (result && result.success && Array.isArray(result.scripts)) {
        for (const s of result.scripts) {
          try {
            await deleteScriptAction({ id: s.id });
          } catch {}
        }
      }
    } catch (err) {
      console.warn("⚠️ Gagal membersihkan skrip backend:", err);
    }
    toast.success("Semua data skrip berhasil dibersihkan.");
  };

  const getScript = (id: string): FullScript | undefined => {
    return scripts.find((s) => s.id === id);
  };

  return (
    <ScriptsContext.Provider
      value={{
        scripts,
        dailyQuota,
        isLoading,
        refreshScripts,
        clearAllScripts,
        addScript,
        updateScript,
        deleteScript,
        duplicateScript,
        markScriptFinal,
        getScript,
      }}
    >
      {children}
    </ScriptsContext.Provider>
  );
}

export function useScripts() {
  const context = useContext(ScriptsContext);
  if (!context) {
    throw new Error("useScripts must be used within ScriptsProvider");
  }
  return context;
}
