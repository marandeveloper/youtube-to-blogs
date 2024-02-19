import { getSubtitles } from "youtube-caption-extractor";
import { gptweb } from "gpti";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const videoID = req.nextUrl.searchParams.get("video_id");

  if (!videoID || Array.isArray(videoID))
    return Response.json({ success: false, message: "Please provide id" });

  try {
    const subs = await getSubtitles({ videoID, lang: "en" });
    if (!subs.length)
      return Response.json({
        success: false,
        message: "Please provide proper id",
        subs,
        videoID,
      });
    console.log(Array.isArray(subs), subs);

    let subtitle: string = "";
    for (const sub of subs) {
      subtitle += sub.text + " ";
    }

    const blog = await new Promise((res, rej) => {
      gptweb(
        {
          prompt: `write blog based on this article ${subtitle} ,  write like you talk directly readers , give Heading and chapters(with subTitile) more addrective. `,
          markdown: true,
        },
        (err, data) => {
          if (err != null) {
            console.log(err);
            rej(err);
          } else {
            res(data);
          }
        }
      );
    });

    return Response.json({
      blog,
      subtitle,
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: error,
      success: true,
    });
  }
}
