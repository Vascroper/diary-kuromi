
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const formatDate = (date) => date.toISOString().split("T")[0];

export default function DiaryApp() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("diaryEntries");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [entry, setEntry] = useState("");
  const [musicUrl, setMusicUrl] = useState("/music/default.mp3");
  const [customMusic, setCustomMusic] = useState(null);

  useEffect(() => {
    const dateKey = formatDate(selectedDate);
    setEntry(entries[dateKey]?.text || "");
    setImage(entries[dateKey]?.image || null);
  }, [selectedDate, entries]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMusicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomMusic(url);
    }
  };

  const handleSave = () => {
    const dateKey = formatDate(selectedDate);
    const updated = {
      ...entries,
      [dateKey]: {
        text: entry,
        image,
      },
    };
    setEntries(updated);
    localStorage.setItem("diaryEntries", JSON.stringify(updated));
    alert("บันทึกเรียบร้อยแล้ว!");
  };

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-center text-pink-700 mb-4">
          ไดอารี่ของฉัน
        </h1>

        <div className="mb-6">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-xl border-pink-300 shadow-md"
            calendarType="gregory"
          />
        </div>

        <Card className="bg-white rounded-2xl shadow-xl p-4">
          <CardContent>
            <p className="text-pink-600 font-semibold mb-2">
              วันที่: {formatDate(selectedDate)}
            </p>
            <Textarea
              className="mb-4"
              placeholder="เขียนไดอารี่ของคุณที่นี่..."
              rows={6}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
            />

            <div className="mb-4">
              <label className="block mb-1 text-pink-600">อัปโหลดรูปภาพ:</label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {image && (
                <div className="mt-4">
                  <div
                    className="relative w-64 h-64 bg-white border-4 border-pink-300 rounded-xl shadow-md overflow-hidden"
                    style={{
                      backgroundImage: `url(/frames/kuromi.png)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <img
                      src={image}
                      alt="uploaded"
                      className="object-cover w-full h-full opacity-80"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-pink-600">อัปโหลดเพลงพื้นหลัง:</label>
              <Input type="file" accept="audio/*" onChange={handleMusicChange} />
            </div>

            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              onClick={handleSave}
            >
              บันทึกไดอารี่
            </Button>
          </CardContent>
        </Card>

        {(customMusic || musicUrl) && (
          <audio autoPlay loop controls className="fixed bottom-4 right-4">
            <source src={customMusic || musicUrl} type="audio/mpeg" />
          </audio>
        )}
      </motion.div>
    </div>
  );
}
