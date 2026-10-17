import json
import re
from pathlib import Path
from docx import Document

# ============================================================
# KONFIGURASI SESUAI FOLDER KAMU
# ============================================================

# Folder tempat 50 file Word berada:
INPUT_FOLDER = Path("cerita kisara")

# Folder hasil JSON:
OUTPUT_FOLDER = Path("hasil_json")

# Chapter 1-5 = gratis, Chapter 6+ = terkunci
LOCK_FROM_CHAPTER = 6


def clean_text(text):
    """Membersihkan spasi yang tidak perlu."""
    text = text.replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def get_title(docx_path):
    """Mengambil judul dari nama file."""
    title = docx_path.stem
    title = re.sub(r"[_-]+", " ", title)
    title = re.sub(r"\s+", " ", title)
    return title.strip()


def detect_chapter(text):
    """
    Mendeteksi format seperti:
    Chapter 1
    Chapter 1: Awal Mula
    Chapter 1 - Awal Mula
    CHAPTER 1
    """
    pattern = r"^\s*chapter\s+(\d+)\s*(?:(?:[:.\-–—])\s*(.*))?\s*$"
    match = re.match(pattern, text, re.IGNORECASE)

    if not match:
        return None

    number = int(match.group(1))
    title = match.group(2).strip() if match.group(2) else f"Chapter {number}"

    return number, title


def read_story(docx_path):
    """Membaca satu file Word dan memisahkan chapter."""
    doc = Document(docx_path)

    paragraphs = []

    for paragraph in doc.paragraphs:
        text = clean_text(paragraph.text)
        if text:
            paragraphs.append(text)

    chapters = []
    current = None

    for paragraph in paragraphs:
        chapter = detect_chapter(paragraph)

        if chapter:
            # Simpan chapter sebelumnya
            if current is not None:
                current["content"] = "\n\n".join(current["_content"]).strip()
                del current["_content"]
                chapters.append(current)

            number, title = chapter

            current = {
                "chapter_number": number,
                "title": title,
                "content": "",
                "is_locked": number >= LOCK_FROM_CHAPTER,
                "_content": []
            }

        elif current is not None:
            current["_content"].append(paragraph)

    # Simpan chapter terakhir
    if current is not None:
        current["content"] = "\n\n".join(current["_content"]).strip()
        del current["_content"]
        chapters.append(current)

    return chapters


def safe_filename(title):
    """Membuat nama file JSON yang aman."""
    name = title.lower()
    name = re.sub(r'[<>:"/\\|?*]', "", name)
    name = re.sub(r"\s+", "-", name)
    return name.strip("-")


def check_chapters(chapters):
    """Mengecek nomor chapter."""
    numbers = [chapter["chapter_number"] for chapter in chapters]

    if not numbers:
        return "TIDAK ADA CHAPTER"

    expected = list(range(1, len(numbers) + 1))

    if numbers != expected:
        return f"CEK NOMOR: {numbers}"

    return "OK"


def main():
    print("=" * 60)
    print("        KONVERTER DATA CERITA KiSara.id")
    print("=" * 60)

    # Cek folder sumber
    if not INPUT_FOLDER.exists():
        print()
        print(f"ERROR: Folder '{INPUT_FOLDER}' tidak ditemukan.")
        print()
        print("Pastikan struktur folder kamu seperti ini:")
        print("kisara-data/")
        print("├── cerita kisara/")
        print("│   ├── cerita1.docx")
        print("│   ├── cerita2.docx")
        print("│   └── ...")
        print("└── convert.py")
        return

    # Cari semua DOCX
    docx_files = sorted(
        INPUT_FOLDER.rglob("*.docx"),
        key=lambda p: p.name.lower()
    )

    if not docx_files:
        print()
        print(f"ERROR: Tidak ada file .docx di dalam '{INPUT_FOLDER}'.")
        return

    OUTPUT_FOLDER.mkdir(exist_ok=True)

    print()
    print(f"Ditemukan {len(docx_files)} file Word.")
    print()

    report = []

    for number, docx_path in enumerate(docx_files, start=1):
        title = get_title(docx_path)

        try:
            chapters = read_story(docx_path)
            chapter_status = check_chapters(chapters)

            data = {
                "title": title,
                "origin": "",
                "synopsis": "",
                "chapters": chapters
            }

            filename = safe_filename(title) + ".json"
            output_path = OUTPUT_FOLDER / filename

            with output_path.open("w", encoding="utf-8") as file:
                json.dump(
                    data,
                    file,
                    ensure_ascii=False,
                    indent=2
                )

            status = "OK" if chapter_status == "OK" else "CEK"

            print(
                f"[{status}] {number:02d}. {title} "
                f"-> {len(chapters)} chapter"
            )

            if chapter_status != "OK":
                print(f"       {chapter_status}")

            report.append({
                "no": number,
                "title": title,
                "jumlah_chapter": len(chapters),
                "status": status,
                "detail": chapter_status,
                "file_json": filename
            })

        except Exception as error:
            print(f"[ERROR] {number:02d}. {title}")
            print(f"        {error}")

            report.append({
                "no": number,
                "title": title,
                "jumlah_chapter": 0,
                "status": "ERROR",
                "detail": str(error),
                "file_json": ""
            })

    # Simpan laporan
    report_path = OUTPUT_FOLDER / "_laporan.json"

    with report_path.open("w", encoding="utf-8") as file:
        json.dump(
            report,
            file,
            ensure_ascii=False,
            indent=2
        )

    print()
    print("=" * 60)
    print("SELESAI!")
    print("=" * 60)
    print()
    print(f"Hasil JSON : {OUTPUT_FOLDER.resolve()}")
    print(f"Laporan    : {report_path.resolve()}")
    print()
    print("Chapter 1-5 : is_locked = false")
    print("Chapter 6+  : is_locked = true")
    print()


if __name__ == "__main__":
    main()