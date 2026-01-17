# Smart Civic Issue Reporting & Management System
## Project Specification & Technical Documentation

### 1. Executive Summary
The **Smart Civic Issue Reporting & Management System** is a next-generation platform designed to bridge the gap between citizens and municipal authorities. Unlike traditional complaint portals, this system leverages **Artificial Intelligence (AI)** and **Geo-Spatial Data** to automate issue classification, prioritize critical problems, and ensure transparent resolution. It aims to foster civic engagement through gamification while optimizing municipal workforce efficiency.

---

### 2. Technology Stack

#### Frontend (Cross-Platform Mobile App)
*   **Citizen & Staff Apps**: **React Native (via Expo)**.
    *   *Why?* Native performance, access to Camera/GPS/File System, and easy deployment to both iOS and Android.
*   **Admin Dashboard**: Next.js (React) for the web-based command center.

#### Backend & API
*   **Runtime**: Node.js
*   **Framework**: Express.js or Hono (for edge performance).
*   **Language**: TypeScript (strict type safety).

#### Database
*   **Primary DB**: MongoDB (NoSQL Document Store).
*   **Geospatial**: MongoDB Geospatial Queries (native `$near`, `$geoIntersects` support).
*   **Caching**: Redis (Optional, as MongoDB handles high read loads well, but useful for leaderboards).
*   **Storage**: AWS S3 or Cloudinary (for secure image storage).

#### AI & ML Services
*   **Image Analysis**: Google Cloud Vision API or custom TensorFlow/PyTorch model (running on Python microservice).
*   **NLP/Chatbot**: OpenAI API (GPT-4o) or open-source LLMs (Llama 3) via HuggingFace.

---

### 3. System Architecture

1.  **Client Layer**: 
    *   Citizen Mobile App
    *   field Staff App
    *   Admin Web Dashboard
2.  **API Gateway / Load Balancer**: Handles requests, rate limiting, and routing.
3.  **Application Core (Business Logic)**:
    *   *Issue Manager*: CRUD operations, state transitions.
    *   *Gamification Engine*: Points calculation, badge assignment.
    *   *Notification Service*: Push notifications (FCM), Emails, SMS.
4.  **AI Microservice**:
    *   Takes Image/Text inputs -> Returns Tags, Categories (Pothole, Garbage), Severity (1-10), and Semantic Duplicates.
5.  **Data Layer**: MongoDB Cluster.

---

### 4. Database Schema Design (MongoDB Collections)

#### `users` Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "role": "String (ENUM: CITIZEN, STAFF, ADMIN)",
  "ward_id": "ObjectId (Ref: Wards)",
  "gamification": {
    "points": "Number",
    "badges": ["String"]
  },
  "createdAt": "Date"
}
```

#### `issues` Collection
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (Ref: Users)",
  "category": "String (ENUM: ROADS, SANITATION...)",
  "status": "String (ENUM: SUBMITTED, IN_PROGRESS, RESOLVED, REJECTED)",
  "priority": "String (ENUM: LOW, MEDIUM, HIGH, CRITICAL)",
  "location": {
    "type": "Point",
    "coordinates": [Longitude, Latitude] // GeoJSON format
  },
  "address_text": "String", // Reverse Geocoded from coords
  "description": "String",
  "media": {
    "before_url": "String", // S3/Cloudinary URL
    "after_url": "String"
  },
  "upvotes": ["ObjectId (Ref: Users)"], // Array of user IDs
  "assigned_to": "ObjectId (Ref: Users/Staff)",
  "sla_deadline": "Date",
  "history": [
    {
      "status_from": "String",
      "status_to": "String",
      "remark": "String",
      "updated_by": "ObjectId",
      "timestamp": "Date"
    }
  ],
  "createdAt": "Date"
}
```

#### `gamification_logs` Collection
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (Ref: Users)",
  "action": "String (REPORT, UPVOTE, VERIFY)",
  "points_earned": "Number",
  "timestamp": "Date"
}
```

---

### 5. Detailed Feature Specifications

#### A. Citizen / User Module
| Feature | Type | Description |
| :--- | :--- | :--- |
| **Smart Reporting** | Core | One-tap GPS capture. AI analyzes uploaded photo to auto-fill Category and Severity. |
| **Duplicate Detection** | **AI** | Before submission, system checks within 50m radius. If a similar issue exists, prompts user to "Upvote" instead. |
| **Gamification** | **New** | Earn +10 XP for reporting, +50 XP for verified resolution. Leaderboard: "Ward Champion". |
| **Offline Mode** | **New** | Save report locally; auto-sync when network returns. |
| **Resolution Verification** | **New** | Citizens can mark a "Resolved" issue as "Not Actually Fixed", reopening the ticket. |

#### B. Municipal Staff Module
| Feature | Type | Description |
| :--- | :--- | :--- |
| **Smart Routing** | **AI** | Staff sees a map optimized for travel to fix multiple nearby issues. |
| **Proof of Work** | Core | Staff MUST upload an "After" photo to close a ticket. AI validates if the issue (e.g., garbage) is actually gone. |
| **SLA Countdown** | **New** | Color-coded timer. "2 Hours remaining" turns Red. |

#### C. Admin / Supervisor Module
| Feature | Type | Description |
| :--- | :--- | :--- |
| **Heatmaps** | **New** | Visual clusters showing "High Failure Zones" (e.g., area with frequent streetlight breaks). |
| **Predictive Analytics** | **AI** | "Warning: heavy rain predicted. Expect drainage issues in Sector A." |
| **Performance Cards** | Core | Metrics per Department (e.g., "Sanitation Dept avg response time: 4hrs"). |

---

### 6. AI & Intelligence Modules

1.  **Auto-Classification**:
    *   *Input*: Image of a broken pipe.
    *   *AI Output*: Category: "Water Supply", Sentiment: "Urgent", Object: "Leaking Pipe".
2.  **Severity Scoring**:
    *   Combines `User Priority` + `AI Assessment` + `Duplicate Count`.
    *   Example: A pothole reported by 1 person = Low Priority. Same pothole reported by 20 people = CRITICAL.
3.  **Fraud Detection**:
    *   Detects if the uploaded image is taken from Google Images or is irrelevant (not a civic issue).

---

### 7. API Endpoints (Preview)

*   `POST /api/v1/issues` - Submit new issue (Multipart form data: image + geo + text).
*   `GET /api/v1/issues/nearby?lat=...&lng=...&radius=500` - Fetch local issues.
*   `POST /api/v1/issues/:id/upvote` - Add support to an issue.
*   `PATCH /api/v1/issues/:id/status` - Staff updates status (requires specific permission).
*   `GET /api/v1/admin/analytics/heatmap` - Returns GeoJSON for heatmap visualization.

---

### 8. Security & Compliance
*   **JWT & RBAC**: Strict separation of Citizen, Staff, and Admin routes.
*   **Data Privacy**: All citizen data anonymized in public feeds.
*   **Audit Logging**: Every status change is immutable and logged (who changed it, when, and why).
