<div align="center">

<img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/8d60e8240732337.69449a43a9dfd.png" alt="Kinnect Pro — Header Hero" width="980" />

# Kinnect Pro — Conexiones con Parentesco (Kin + Connect)

Una experiencia web moderna para **crear, organizar y presentar conexiones familiares** con una interfaz limpia, rápida y centrada en la experiencia de usuario.

🌐 **Live:** https://kinnect-pro.vercel.app/

</div>


---

## 📌 Resumen

**Kinnect Pro** es una versión evolutiva del concepto Kinnect: un espacio donde la información familiar deja de estar dispersa (chats, notas, contactos) y pasa a estar **estructurada**, **navegable** y lista para crecer hacia un **árbol familiar visual**, perfiles y grupos.

---

## 🎯 Problema

- La información familiar vive en múltiples lugares y se pierde con el tiempo.
- Es difícil recordar relaciones entre ramas (primos, tíos, abuelos).
- No existe un “lugar único” para mantener datos actualizados y compartibles.

---

## ✅ Solución (lo que propone Kinnect Pro)

- Un punto central para **registrar personas** y **definir relaciones**.
- Una experiencia UI/UX minimalista, clara y escalable.
- Base ideal para evolucionar hacia:
  - **Árbol familiar** interactivo
  - **Grupos** por familia y permisos
  - **Compartir** conexiones por link/QR
  - **Notas y adjuntos** por persona

---

## ✨ Highlights

- UI moderna (enfoque en legibilidad y jerarquía visual)
- Flujo pensado para crecer (personas → relaciones → visualización)
- Preparado para módulos avanzados (roadmap)

---

## 🖼️ Capturas (grid)

<div align="center">

<table>
  <tr>
    <td>
      <img src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/f9d5c2240732337.69449a43abc7f.png" alt="Kinnect Pro — Captura 1" width="420" />
    </td>
    <td>
      <img src="https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/f345e9240732337.69449a43ab5f5.png" alt="Kinnect Pro — Captura 2" width="420" />
    </td>
  </tr>
</table>

</div>

---

## 🧭 Flujo de uso (alto nivel)

1. Crear/gestionar personas (datos básicos + notas opcionales)
2. Definir relaciones (parentesco y vínculos)
3. Navegar conexiones por búsqueda o visualización
4. (Roadmap) Visualizar árbol familiar / compartir / colaborar

---

## 🧱 Modelo conceptual (simple)

### Entidades
- **User**
- **Person**
- **Relationship** (tipo de parentesco: parent, child, sibling, partner, etc.)
- **FamilyGroup** (opcional, para colaboración)
- **Membership** (roles: admin/member/viewer)

### Reglas recomendadas
- Evitar duplicados por nombre/alias + validación
- Relaciones dirigidas (A → B) + tipo
- Permisos por grupo (si aplica colaboración)

---

## 🔒 Privacidad & seguridad (recomendado)

- Acceso protegido por autenticación
- Permisos por usuario/grupo (principio de menor privilegio)
- HTTPS + buenas prácticas de sesión
- Opciones de exportación/eliminación de datos (si se publica como producto)

---

## 🗺️ Roadmap

- [ ] CRUD completo de Personas
- [ ] CRUD completo de Relaciones
- [ ] Búsqueda + filtros (por rama, apellido, tags)
- [ ] Árbol familiar visual (vista interactiva)
- [ ] Grupos/roles y colaboración
- [ ] Importar/exportar (CSV/JSON)
- [ ] Compartir por link/QR con permisos

---

## 👤 Autor

**Armando Ovalle Jácome**  
🌐 Portafolio: https://www.jacomeovalle.com/  
🔗 Live: https://kinnect-pro.vercel.app/

---
