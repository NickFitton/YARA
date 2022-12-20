package com.yara.textService;

import android.graphics.Point
import android.graphics.Rect
import android.net.Uri
import com.facebook.react.bridge.*
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions

class TextRecognitionManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "TextRecognitionManager"
    }

    @ReactMethod
    fun parseTextInImage (path: String, promise: Promise) {
        try {
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            val image = InputImage.fromFilePath(this.reactApplicationContext, Uri.parse(path))

            recognizer.process(image)
                .addOnSuccessListener { visionText ->
                    promise.resolve(getDataAsArray(visionText))
                }
                .addOnFailureListener(promise::reject)
        } catch (e: Exception) {
            promise.reject(e);
        }
    }

    // TODO: inspect and refactor this
    private fun getCoordinates(boundingBox: Rect?): WritableMap {
        val coordinates: WritableMap = Arguments.createMap()
        if (boundingBox == null) {
            coordinates.putNull("top")
            coordinates.putNull("left")
            coordinates.putNull("width")
            coordinates.putNull("height")
        } else {
            coordinates.putInt("top", boundingBox.top)
            coordinates.putInt("left", boundingBox.left)
            coordinates.putInt("width", boundingBox.width())
            coordinates.putInt("height", boundingBox.height())
        }
        return coordinates;
    }

    // TODO: inspect and refactor this
    private fun getCornerPoints(pointsList: Array<Point>?): WritableArray {
        val p: WritableArray = Arguments.createArray()
        if (pointsList == null) {
            return p;
        }

        pointsList.forEach { point ->
            val i: WritableMap = Arguments.createMap()
            i.putInt("x", point.x);
            i.putInt("y", point.y);
            p.pushMap(i);
        }

        return p;
    }

    // TODO: inspect and refactor this
    private fun getDataAsArray(visionText: Text): WritableArray? {
        val data: WritableArray = Arguments.createArray()

        for (block in visionText.textBlocks) {
            val blockElements: WritableArray = Arguments.createArray()
            for (line in block.lines) {
                val lineElements: WritableArray = Arguments.createArray()
                for (element in line.elements) {
                    val e: WritableMap = Arguments.createMap()
                    e.putString("text", element.text)
                    e.putMap("bounding", getCoordinates(element.boundingBox))
                    e.putArray("cornerPoints", getCornerPoints(element.cornerPoints))
                    lineElements.pushMap(e)
                }
                val l: WritableMap = Arguments.createMap()
                val lCoordinates = getCoordinates(line.boundingBox)
                l.putString("text", line.text)
                l.putMap("bounding", lCoordinates)
                l.putArray("elements", lineElements)
                l.putArray("cornerPoints", getCornerPoints(line.cornerPoints))

                blockElements.pushMap(l)
            }

            val info: WritableMap = Arguments.createMap()


            info.putMap("bounding", getCoordinates(block.boundingBox))
            info.putString("text", block.text)
            info.putArray("lines", blockElements)
            info.putArray("cornerPoints", getCornerPoints(block.cornerPoints))
            data.pushMap(info)
        }
        return data
    }


}