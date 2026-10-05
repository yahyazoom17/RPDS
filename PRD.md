# Road Pothole Detector — PPT Content

## Slide 1 — Title

# Road Pothole Detection System

### IoT + AI Based Smart Road Monitoring Prototype

- Detect potholes using vehicle vibration data
- Capture pothole location using GPS
- Send detected events to a backenvibrationd server
- Visualize potholes on a digital map
- Future scope: combine sensors with computer vision

---

## Slide 2 — Problem Statement

### The Problem

- Potholes create safety risks for vehicles and road users.
- Manual road inspection is slow, expensive, and difficult to scale.
- Many potholes remain unreported or are reported only after accidents or vehicle damage.
- A vehicle-mounted system can automatically identify abnormal road conditions while travelling.

### Goal

Build a low-cost prototype that can automatically detect potholes, record their GPS coordinates, estimate severity, and display them on a map.

---

## Slide 3 — Proposed Solution

### Smart Pothole Detection Architecture

```text
        Vehicle
           │
           ▼
   ┌─────────────────┐
   │ Accelerometer   │
   │   MPU6050       │
   └────────┬────────┘
            │
            ▼
        ESP32
     ┌──────┴──────┐
     │             │
   GPS          Detection
     │             │
     └──────┬──────┘
            ▼
       Wi-Fi / 4G
            │
            ▼
      FastAPI Server
            │
       ┌────┴─────┐
       ▼          ▼
   Database     Dashboard
```

### Core idea

The system detects abnormal vertical acceleration caused by potholes and associates the event with the vehicle's GPS location.

---

## Slide 4 — Hardware Components

### Recommended Prototype Hardware

| Component            | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| ESP32                | Main microcontroller and communication            |
| MPU6050              | Measures acceleration and detects road vibrations |
| NEO-6M GPS           | Captures pothole location                         |
| OLED Display         | Displays detection/status information             |
| Battery / Power Bank | Portable power supply                             |
| Buzzer               | Optional local alert                              |

### MVP Approach

Start with **ESP32 + MPU6050** without GPS to validate detection. Add GPS after the detection algorithm works reliably.

---

## Slide 5 — How Pothole Detection Works

### Detection Principle

The MPU6050 continuously measures acceleration along three axes:

- **X-axis:** longitudinal vehicle movement
- **Y-axis:** lateral vehicle movement
- **Z-axis:** vertical vehicle movement

A pothole can cause a sudden change in vertical acceleration.

```text
Normal road:

     ────────╲───────╱────────

Acceleration:
       ~~~~~~~~~~~~~~~

Pothole:

     ───────╲      ╱────────
              ╲____╱

Acceleration:
       ~~~~~~~╲__╱~~~~~~
                ↑
             spike
```

### Important factors

Acceleration spikes can also be caused by:

- Speed breakers
- Braking
- Sudden acceleration
- Rough roads
- Turning
- Vehicle suspension

Therefore, a single acceleration threshold is useful for an MVP but is not sufficient for a robust final system.

---

## Slide 6 — Basic Detection Algorithm

### Step 1: Read Sensor Data

Continuously collect:

- `ax`
- `ay`
- `az`

### Step 2: Establish a Baseline

Determine the normal acceleration level while travelling on a smooth road.

### Step 3: Detect Abnormal Events

```python
if abs(acceleration_z - baseline_z) > THRESHOLD:
    pothole_detected = True
```

### Step 4: Improve the Detection

Instead of relying on one sample:

- Use a sliding window
- Filter sensor noise
- Analyze the duration of the event
- Consider vehicle speed
- Compare multiple acceleration features

---

## Slide 7 — Acceleration Magnitude

### Combining the Three Axes

Calculate acceleration magnitude:

```python
import math

magnitude = math.sqrt(
    ax**2 +
    ay**2 +
    az**2
)
```

This provides a more orientation-independent representation of the vehicle's motion.

### Why it helps

Using acceleration magnitude can make the system less dependent on the exact sensor mounting orientation and provide a useful feature for classification.

---

## Slide 8 — Improved Signal Processing Pipeline

### From Raw Sensor Data to Detection

```text
Sensor
  ↓
Sampling ~100 Hz
  ↓
Noise Filtering
  ↓
Sliding Window
  ↓
Feature Extraction
  ↓
Pothole Classifier
  ↓
GPS Location
```

### Useful Features

- Peak acceleration
- Minimum acceleration
- RMS acceleration
- Change in acceleration
- Event duration
- Number of acceleration peaks
- Vehicle speed

---

## Slide 9 — Data Collection

### Build a Dataset Before Training AI

Record sensor and GPS information during real-world driving.

Example data structure:

```text
timestamp, ax, ay, az, speed, latitude, longitude, label
```

Example:

```csv
time,ax,ay,az,speed,label
10.01,0.12,0.03,9.81,25,normal
10.02,0.15,0.02,9.76,25,normal
10.03,0.21,0.05,13.42,25,pothole
10.04,0.18,0.04,7.12,25,pothole
```

---

## Slide 10 — Data Collection Scenarios

### Capture Different Road Conditions

Collect data for:

- Normal / smooth road
- Potholes
- Speed breakers
- Rough road
- Braking
- Acceleration
- Turning

### Why this matters

The model must learn to distinguish potholes from other events that produce similar vibration patterns.

A diverse dataset improves reliability and reduces false detections.

---

## Slide 11 — Machine Learning Approach

### Move From Rules to AI

Once sufficient data is collected:

```text
MPU6050 Data
      ↓
Feature Extraction
      ↓
Random Forest / XGBoost
      ↓
Classification
```

### Possible Classes

- NORMAL
- ROUGH ROAD
- SPEED BREAKER
- POTHOLE

### Recommended Starting Model

**Random Forest**

Reasons:

- Works well with small tabular datasets
- Easy to train
- Easy to interpret
- Suitable for a prototype
- Does not require a large neural network

---

## Slide 12 — GPS Location Tracking

### Record the Location of Each Detected Pothole

When a pothole is detected, the system can create an event such as:

```json
{
  "event": "pothole",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "severity": 0.82,
  "speed": 32,
  "timestamp": "2026-10-04T21:00:00"
}
```

### Information Captured

- Pothole type
- Latitude
- Longitude
- Detection confidence / severity
- Vehicle speed
- Timestamp

---

## Slide 13 — IoT and Backend Architecture

### End-to-End Data Flow

```text
Vehicle Sensors
      ↓
ESP32
      ↓
Wi-Fi / 4G
      ↓
FastAPI Backend
      ↓
Database
      ↓
Dashboard / Map
```

### Possible Technologies

Frontend

- React

Backend

- Python
- FastAPI

Database

- Appwrite

The backend stores pothole events in database and makes them available for visualization and analytics in frontend.

---

## Slide 14 — Pothole Mapping Dashboard

### Visualizing Detected Potholes

```text
             POTHOLE MAP

       🔴 Severe
       🟠 Medium
       🟡 Minor

          Bengaluru
       ┌─────────────┐
       │ 🔴          │
       │       🟡    │
       │   🟠        │
       │          🔴 │
       └─────────────┘
```

### Dashboard Features

- Interactive road map
- Pothole markers
- Severity classification
- Detection timestamp
- Number of detections
- Historical pothole data
- Filtering by severity or date

---

## Slide 15 — Advanced AI Version

### Sensor + Computer Vision

A more advanced system can combine an onboard camera with the accelerometer.

```text
                 Vehicle
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
     Camera                  MPU6050
        │                       │
        ▼                       ▼
 YOLO Pothole Model      Vibration Detection
        │                       │
        └───────────┬───────────┘
                    ▼
              Sensor Fusion
                    │
                    ▼
          Pothole Confidence
                    │
                    ▼
               GPS Location
                    │
                    ▼
                 Server
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Pothole Map          Analytics
```

---

## Slide 16 — Sensor Fusion

### Combining Independent Signals

Example:

```text
Camera:        pothole = 91%
Accelerometer: abnormal = 87%
GPS:           valid

              ↓

Final confidence = 94%

              ↓

       POTHOLE CONFIRMED
```

### Benefits

- Reduces false positives
- Confirms potholes using two independent sources
- Improves detection reliability
- Enables visual verification
- Provides a stronger AI demonstration

---

## Slide 17 — MVP Development Plan

### Phase 1 — Sensor Prototype

**ESP32 + MPU6050**

- Read acceleration
- Display sensor values
- Detect abnormal vibration
- Test different road conditions

### Phase 2 — Data Collection

- Record acceleration data
- Label road events
- Build a dataset
- Analyze vibration patterns

### Phase 3 — GPS Integration

- Add GPS module
- Attach coordinates to detection events
- Store pothole locations

---

## Slide 18 — MVP Development Plan: Backend and AI

### Phase 4 — Backend

```text
ESP32 → Wi-Fi → FastAPI → Database
```

Implement:

- REST API
- Event storage
- Pothole records
- Detection timestamps
- GPS coordinates

### Phase 5 — Machine Learning

- Extract features
- Train Random Forest / XGBoost
- Evaluate accuracy
- Reduce false positives

### Phase 6 — Dashboard

- Map potholes
- Display severity
- Show statistics
- View historical detections

---

## Slide 19 — Final Recommended Prototype

### College / Demonstration Version

```text
ESP32
  +
MPU6050
  +
GPS
  ↓
Wi-Fi
  ↓
FastAPI
  ↓
Database
  ↓
Live Pothole Map
```

### Future Enhancement

Add:

```text
Camera
   ↓
YOLO
   ↓
Sensor Fusion
   ↓
Higher-confidence Pothole Detection
```

### Demonstration

Mount the prototype on:

- Bicycle
- Scooter
- Car

Drive over controlled examples of:

- Smooth road
- Speed breaker
- Rough road
- Pothole

Compare sensor output and demonstrate the resulting map.

---

## Slide 20 — Key Benefits

### Advantages of the Proposed System

- Low-cost prototype
- Automatic pothole detection
- GPS-based location tracking
- Real-time or near-real-time reporting
- Scalable IoT architecture
- Can collect a continuously growing road-condition dataset
- AI can improve detection accuracy over time
- Useful for smart-city and road-maintenance applications

---

## Slide 21 — Challenges and Considerations

### Technical Challenges

- Sensor mounting orientation
- Vehicle suspension differences
- Different vehicle speeds
- False positives from speed breakers
- False positives from braking and acceleration
- GPS accuracy
- Sensor noise
- Limited training data
- Communication connectivity

### Key Design Principle

A reliable system should combine **signal processing, contextual information, and machine learning**, rather than depending only on a fixed acceleration threshold.

---

## Slide 22 — Future Scope

### Possible Extensions

1. Camera-based pothole detection using YOLO
2. Sensor fusion for higher confidence
3. Cloud-based road-condition database
4. Crowdsourced pothole reporting
5. Road-quality heat maps
6. Severity estimation
7. Automatic alerts to road-maintenance authorities
8. Predictive road-maintenance analytics
9. Edge AI running directly on the vehicle
10. Integration with smart-city infrastructure

---

## Slide 23 — Complete System Overview

### Final Architecture

```text
        ┌───────────────────────┐
        │       VEHICLE         │
        │                       │
        │  MPU6050 + GPS        │
        │  Optional Camera      │
        └───────────┬───────────┘
                    │
                    ▼
                 ESP32
                    │
                    ▼
              Wi-Fi / 4G
                    │
                    ▼
              FastAPI API
                    │
             ┌──────┴──────┐
             ▼             ▼
         Database      ML Service
             │             │
             └──────┬──────┘
                    ▼
             Web Dashboard
                    │
             ┌──────┴──────┐
             ▼             ▼
        Pothole Map    Analytics
```

### End Result

A low-cost smart-road monitoring platform that detects potholes, records their locations, estimates severity, and provides actionable road-condition information.

---

## Slide 24 — Conclusion

### Conclusion

The proposed pothole detector combines:

- **IoT sensors** for vibration detection
- **ESP32** for edge processing and communication
- **GPS** for accurate location tagging
- **FastAPI + database** for data management
- **Machine learning** for improved classification
- **Computer vision** as a future enhancement
- **Interactive mapping** for road-condition visualization

### Recommended Development Strategy

**Start simple → collect data → validate detection → add GPS → build backend → train ML → add computer vision.**

This approach keeps the prototype affordable while providing a clear path toward a scalable AI-powered road monitoring system.
