"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, Minus, Plus, Clock } from "lucide-react";

const LockableUI = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [unlockDuration, setUnlockDuration] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [additionalHours, setAdditionalHours] = useState(1);
  const [appStatus, setAppStatus] = useState("");
  const [appLoading, setAppLoading] = useState(false);
  const [appUrl, setAppUrl] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isLocked && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, timeRemaining]);

  const handleUnlock = (duration: number) => {
    setIsLocked(false);
    setTimeRemaining(duration * 3600);
    startApp();
  };

  const addTime = () => {
    setTimeRemaining((prev) => prev + additionalHours * 3600);
  };

  const startApp = () => {
    setAppLoading(true);
    setAppStatus("Starting app...");
    // Simulating app start
    setTimeout(() => {
      setAppLoading(false);
      setAppStatus("App started");
      setAppUrl("https://example.com/premium-content");
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return "Unlimited Access";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold flex items-center justify-between mb-2 text-white">
            {isLocked ? (
              <>
                Premium Content <Lock className="h-6 w-6" />
              </>
            ) : (
              <>
                Unlocked Premium Content <Unlock className="h-6 w-6" />
              </>
            )}
          </h2>
          <p className="text-gray-400 mb-6">
            {isLocked ? "Unlock to access exclusive content" : "Enjoy your premium access"}
          </p>

          {isLocked ? (
            <div className="space-y-6">
              <div className="bg-gray-800 border-l-4 border-gray-500 text-gray-300 p-4 mb-4" role="alert">
                <h3 className="text-lg font-semibold">Content is locked</h3>
                <p>Unlock the content for 100 tokens per hour. Choose your preferred duration below.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setUnlockDuration(Math.max(1, unlockDuration - 1))}
                    className="h-16 w-16 bg-gray-700 hover:bg-gray-600 text-white"
                    variant="outline"
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <Input
                    type="number"
                    value={unlockDuration}
                    className="w-20 h-16 p-2 text-center text-lg bg-gray-800 text-white border-gray-700"
                    disabled
                  />
                  <Button
                    onClick={() => setUnlockDuration((prev) => prev + 1)}
                    disabled={unlockDuration >= 10}
                    className="h-16 w-16 bg-gray-700 hover:bg-gray-600 text-white"
                    variant="outline"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={() => handleUnlock(unlockDuration)}
                    className="h-16 flex-grow text-lg bg-white text-gray-900 hover:bg-gray-200"
                  >
                    Unlock for {unlockDuration} hour{unlockDuration > 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-800 border-l-4 border-gray-500 text-gray-300 p-4 mb-4" role="alert">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="mr-2 h-6 w-6" /> Time Remaining
                </h3>
                <p className="text-xl font-bold">{formatTime(timeRemaining)}</p>
              </div>
              {timeRemaining !== Infinity && (
                <Progress value={(timeRemaining / (unlockDuration * 3600)) * 100} className="w-full" />
              )}
              <div className="bg-gray-800 p-4 rounded-lg text-white">
                <h2>{appStatus}</h2>
                {appLoading ? (
                  <p>Loading App. Please wait for up to 5 minutes.</p>
                ) : (
                  <p>Unlocked Premium Content URL: {appUrl}</p>
                )}
              </div>
              {timeRemaining !== Infinity && (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setAdditionalHours(Math.max(1, additionalHours - 1))}
                    className="h-12 w-12 bg-gray-700 hover:bg-gray-600 text-white"
                    variant="outline"
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <Input
                    type="number"
                    value={additionalHours}
                    onChange={(e) => setAdditionalHours(parseInt(e.target.value))}
                    className="w-20 h-12 p-2 text-center text-lg bg-gray-800 text-white border-gray-700"
                  />
                  <Button
                    onClick={() => setAdditionalHours((prev) => prev + 1)}
                    className="h-12 w-12 bg-gray-700 hover:bg-gray-600 text-white"
                    variant="outline"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                  <Button onClick={addTime} className="h-12 flex-grow text-lg bg-white text-gray-900 hover:bg-gray-200">
                    Add {additionalHours} hour{additionalHours > 1 ? "s" : ""}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LockableUI;