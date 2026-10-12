// KIRIS Plataforma - Suite de Pruebas Automatizadas E2E y de Integración
// Basado en el estándar de e2e-testing-patterns

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(name, passed, error = null) {
  if (passed) {
    TEST_RESULTS.passed++;
    TEST_RESULTS.tests.push({ name, status: "PASSED" });
    console.log(`  ✓ [PASS] ${name}`);
  } else {
    TEST_RESULTS.failed++;
    TEST_RESULTS.tests.push({ name, status: "FAILED", error: error?.message });
    console.error(`  ✗ [FAIL] ${name} -> ${error?.message || error}`);
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  INICIANDO SUITE DE PRUEBAS E2E & DE INTEGRACIÓN (KIRIS)");
  console.log("=======================================================\n");

  const projectRoot = process.cwd();

  // Test 1: Verificar que no existan datos ficticios en schema.sql
  try {
    const schemaSql = fs.readFileSync(path.join(projectRoot, "supabase", "schema.sql"), "utf-8");
    assert.ok(!schemaSql.includes("INSERT INTO public.social_links"), "No debe tener INSERT en social_links");
    assert.ok(!schemaSql.includes("INSERT INTO public.categories"), "No debe tener INSERT en categories");
    assert.ok(!schemaSql.includes("INSERT INTO public.auxiliaries"), "No debe tener INSERT en auxiliaries");
    assert.ok(schemaSql.includes("ENABLE ROW LEVEL SECURITY"), "Debe habilitar RLS en las tablas");
    assert.ok(schemaSql.includes("CREATE POLICY"), "Debe definir políticas RLS");
    recordTest("1. Seguridad & Limpieza: schema.sql sin datos de prueba y con RLS activo", true);
  } catch (err) {
    recordTest("1. Seguridad & Limpieza: schema.sql sin datos de prueba y con RLS activo", false, err);
  }

  // Test 2: Verificar que initialData.ts contenga arreglos vacíos []
  try {
    const initialData = fs.readFileSync(path.join(projectRoot, "lib", "data", "initialData.ts"), "utf-8");
    assert.ok(initialData.includes("defaultSocialLinks: SocialLink[] = []"), "defaultSocialLinks debe ser []");
    assert.ok(initialData.includes("defaultCategories: Category[] = []"), "defaultCategories debe ser []");
    assert.ok(initialData.includes("defaultRecommendations: Recommendation[] = []"), "defaultRecommendations debe ser []");
    assert.ok(initialData.includes("defaultAuxiliaries: Auxiliary[] = []"), "defaultAuxiliaries debe ser []");
    recordTest("2. Estado Limpio: initialData.ts con colecciones vacías por defecto", true);
  } catch (err) {
    recordTest("2. Estado Limpio: initialData.ts con colecciones vacías por defecto", false, err);
  }

  // Test 3: Verificar componentes del Sistema de Temas (ThemeProvider y ThemeToggle)
  try {
    const themeProvider = fs.readFileSync(path.join(projectRoot, "components", "ThemeProvider.tsx"), "utf-8");
    const themeToggle = fs.readFileSync(path.join(projectRoot, "components", "ThemeToggle.tsx"), "utf-8");
    assert.ok(themeProvider.includes("localStorage.getItem"), "ThemeProvider debe sincronizar con localStorage");
    assert.ok(themeProvider.includes("prefers-color-scheme"), "ThemeProvider debe respetar preferencia del sistema");
    assert.ok(themeToggle.includes("aria-label"), "ThemeToggle debe incluir accesibilidad aria-label");
    recordTest("3. Sistema Dual: ThemeProvider y ThemeToggle con persistencia y accesibilidad", true);
  } catch (err) {
    recordTest("3. Sistema Dual: ThemeProvider y ThemeToggle con persistencia y accesibilidad", false, err);
  }

  // Test 4: Prevención de Errores: ConfirmModal para acciones destructivas (Nielsen Heuristic 5)
  try {
    const confirmModal = fs.readFileSync(path.join(projectRoot, "components", "ConfirmModal.tsx"), "utf-8");
    assert.ok(confirmModal.includes('role="dialog"'), "ConfirmModal debe tener role dialog");
    assert.ok(confirmModal.includes('aria-modal="true"'), "ConfirmModal debe tener aria-modal true");
    assert.ok(confirmModal.includes('Escape'), "ConfirmModal debe cerrarse con tecla Escape");
    
    const dashboard = fs.readFileSync(path.join(projectRoot, "app", "admin", "dashboard", "page.tsx"), "utf-8");
    assert.ok(dashboard.includes("ConfirmModal"), "Dashboard debe usar ConfirmModal para borrado");
    assert.ok(dashboard.includes("setDeleteTarget"), "Dashboard debe gestionar estado de eliminación confirmada");
    recordTest("4. Heurística 5: Modal de confirmación para prevenir eliminaciones accidentales", true);
  } catch (err) {
    recordTest("4. Heurística 5: Modal de confirmación para prevenir eliminaciones accidentales", false, err);
  }

  // Test 5: Validación de URLs e Integridad de Entradas (Nielsen Heuristic 9)
  try {
    const dashboard = fs.readFileSync(path.join(projectRoot, "app", "admin", "dashboard", "page.tsx"), "utf-8");
    assert.ok(dashboard.includes("recUrlError"), "Dashboard debe validar URL de recomendaciones");
    assert.ok(dashboard.includes("socialUrlError"), "Dashboard debe validar URL de redes sociales");
    assert.ok(dashboard.includes("startsWith(\"http://\")"), "Dashboard debe exigir protocolo válido");
    recordTest("5. Heurística 9: Validación estricta y feedback inline para entradas y URLs", true);
  } catch (err) {
    recordTest("5. Heurística 9: Validación estricta y feedback inline para entradas y URLs", false, err);
  }

  // Test 6: Verificación de Animaciones (MouseFollower & AnimatedBackground)
  try {
    const mouseFollower = fs.readFileSync(path.join(projectRoot, "components", "MouseFollower.tsx"), "utf-8");
    const animatedBg = fs.readFileSync(path.join(projectRoot, "components", "AnimatedBackground.tsx"), "utf-8");
    const layout = fs.readFileSync(path.join(projectRoot, "app", "layout.tsx"), "utf-8");

    assert.ok(mouseFollower.includes("prefers-reduced-motion"), "MouseFollower debe respetar reduced motion");
    assert.ok(mouseFollower.includes("pointer: coarse"), "MouseFollower debe deshabilitarse en táctil");
    assert.ok(mouseFollower.includes("canvas") || mouseFollower.includes("translate3d"), "MouseFollower debe usar aceleración GPU");
    assert.ok(animatedBg.includes("pointer-events-none"), "AnimatedBackground debe ser no intrusivo");
    assert.ok(layout.includes("<MouseFollower />"), "RootLayout debe integrar MouseFollower");
    assert.ok(layout.includes("<AnimatedBackground />"), "RootLayout debe integrar AnimatedBackground");
    recordTest("6. Experiencia Visual: Seguidor de mouse y fondo animado acelerados por GPU", true);
  } catch (err) {
    recordTest("6. Experiencia Visual: Seguidor de mouse y fondo animado acelerados por GPU", false, err);
  }

  // Test 7: Verificación de Atributos de Automatización E2E (data-testid)
  try {
    const dashboard = fs.readFileSync(path.join(projectRoot, "app", "admin", "dashboard", "page.tsx"), "utf-8");
    assert.ok(dashboard.includes('data-testid="admin-tab-resumen"'), "Debe incluir testid de tabs");
    assert.ok(dashboard.includes('data-testid="admin-subject-name"'), "Debe incluir testid de materia");
    assert.ok(dashboard.includes('data-testid="admin-save-aux-btn"'), "Debe incluir testid de guardar");
    recordTest("7. Patrones E2E: Selectores estables data-testid para automatización", true);
  } catch (err) {
    recordTest("7. Patrones E2E: Selectores estables data-testid para automatización", false, err);
  }

  // Resumen final
  console.log("\n-------------------------------------------------------");
  console.log(`  RESUMEN: ${TEST_RESULTS.passed} superadas, ${TEST_RESULTS.failed} fallidas de ${TEST_RESULTS.tests.length} pruebas.`);
  console.log(`  PORCENTAJE DE APROBACIÓN: ${((TEST_RESULTS.passed / TEST_RESULTS.tests.length) * 100).toFixed(1)}%`);
  console.log("-------------------------------------------------------\n");

  if (TEST_RESULTS.failed > 0) {
    process.exit(1);
  }
}

runTests();
