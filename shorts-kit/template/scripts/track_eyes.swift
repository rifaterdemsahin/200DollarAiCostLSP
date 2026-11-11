// Eye tracker for the A-roll (macOS Vision). Usage: swiftc -O scripts/track_eyes.swift -o /tmp/track_eyes && /tmp/track_eyes <frames_dir> <fps> <out.json>
// Frames are 540x960 jpgs from `ffmpeg -vf fps=10,scale=540:960`; output coords are normalised 0..1 (origin top-left).
import Foundation
import Vision
import AppKit
let dir = CommandLine.arguments[1], fps = Double(CommandLine.arguments[2])!, out = CommandLine.arguments[3]
let files = try FileManager.default.contentsOfDirectory(atPath: dir).filter { $0.hasSuffix(".jpg") }.sorted()
var rows: [[String: Any]] = []
for (i, f) in files.enumerated() {
  guard let img = NSImage(contentsOfFile: dir + "/" + f), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let req = VNDetectFaceLandmarksRequest(); let h = VNImageRequestHandler(cgImage: cg, options: [:]); try? h.perform([req])
  guard let face = req.results?.first, let lm = face.landmarks, let l = lm.leftEye, let r = lm.rightEye else { rows.append(["t": Double(i)/fps, "ok": false]); continue }
  func c(_ reg: VNFaceLandmarkRegion2D) -> (Double, Double) {
    let b = face.boundingBox; let p = reg.normalizedPoints; let n = Double(p.count)
    let x = p.map { Double($0.x) }.reduce(0, +)/n, y = p.map { Double($0.y) }.reduce(0, +)/n
    return (Double(b.origin.x) + x*Double(b.size.width), 1 - (Double(b.origin.y) + y*Double(b.size.height)))
  }
  let (lx, ly) = c(l), (rx, ry) = c(r)
  rows.append(["t": Double(i)/fps, "ok": true, "lx": lx, "ly": ly, "rx": rx, "ry": ry, "roll": Double(truncating: face.roll ?? 0)])
}
try JSONSerialization.data(withJSONObject: rows, options: [.prettyPrinted]).write(to: URL(fileURLWithPath: out))
print("frames:", rows.count, "detected:", rows.filter { ($0["ok"] as? Bool) == true }.count)
