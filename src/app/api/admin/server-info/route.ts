import { NextResponse } from "next/server";
import { execSync } from "child_process";
import os from "os";

export async function GET() {
  try {
    const hostname = os.hostname();
    const platform = os.platform() + " " + os.release();
    const cpuModel = os.cpus()[0]?.model || "Unknown";
    const cpuCores = os.cpus().length;
    const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    const usedMemory = ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    const uptime = formatUptime(os.uptime());

    let diskUsage = "N/A";
    let listeningPorts = "N/A";
    let processes = "N/A";
    let ips: string[] = [];

    // Get IPs
    const networkInterfaces = os.networkInterfaces();
    for (const name of Object.keys(networkInterfaces)) {
      const nets = networkInterfaces[name] || [];
      for (const net of nets) {
        if (net.family === "IPv4" && !net.internal) {
          ips.push(net.address);
        }
      }
    }

    // Try to get disk usage
    try {
      if (os.platform() === "linux" || os.platform() === "darwin") {
        const diskOutput = execSync("df -h / 2>/dev/null | tail -1").toString().trim();
        const parts = diskOutput.split(/\s+/);
        if (parts.length >= 5) {
          diskUsage = parts[2] + " / " + parts[1] + " (" + parts[4] + ")";
        }
      }
    } catch {
      // Ignore errors
    }

    // Try to get listening ports
    try {
      const portsOutput = execSync("ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null || echo 'N/A'").toString().trim();
      const portLines = portsOutput.split("\n").filter((line) => line.includes("LISTEN"));
      if (portLines.length > 0) {
        listeningPorts = portLines.map((line) => {
          const match = line.match(/:(\d+)/);
          return match ? match[1] : "";
        }).filter(Boolean).join(", ");
      }
    } catch {
      // Ignore errors
    }

    // Try to get process count
    try {
      processes = execSync("ps aux 2>/dev/null | wc -l || echo 'N/A'").toString().trim();
    } catch {
      // Ignore errors
    }

    const info = {
      hostname,
      platform,
      cpuModel,
      cpuCores,
      totalMemory,
      freeMemory,
      usedMemory,
      diskUsage,
      uptime,
      ips,
      listeningPorts,
      processes,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(info);
  } catch (error) {
    console.error("Error getting server info:", error);
    return NextResponse.json({ error: "Error getting server info" }, { status: 500 });
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return days + "d " + hours + "h " + mins + "m";
}
