<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class DownloadController extends Controller
{
    /**
     * Displays the main downloads page, or returns json.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $downloads = DB::table('downloads')
                            ->join('downloadsBuilds', function ($join) {
                                $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId')
                                     ->where('downloadsBuilds.flavourId', '=', 1);
                            })
                            ->select('downloads.*', "downloadsBuilds.status")
                            ->orderBy('downloadId', 'desc')
                            ->take(25)
                            ->get();

        $latest['stable'] = DB::table('downloads')
                            ->where('gitBranch', 'master')
                            ->orderBy('downloadId', 'desc')
                            ->first()
                            ->version;

        $latest['develop'] = DB::table('downloads')
                            ->where('gitBranch', 'develop')
                            ->orderBy('downloadId', 'desc')
                            ->first()
                            ->version;

        if ($request->wantsJson()) {
            return $downloads;
        }
        return view('download.index', ['downloads' => $downloads, 'latest' => $latest]);
    }

    /**
     * Displays the download page, or returns json of a specific downloadId.
     *
     * @param  int  $downloadId
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(int $downloadId, Request $request)
    {
        $download = DB::table('downloads')
                            ->join('downloadsBuilds', function ($join) {
                                $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId')
                                     ->where('downloadsBuilds.flavourId', '=', 1);
                            })
                            ->select('downloads.*', "downloadsBuilds.status")
                            ->where('downloadId', $downloadId)
                            ->orderBy('downloadId', 'desc')
                            ->first();


        /* $downloadsBuilds = DB::table('downloadsBuilds')
                            ->where('downloadsBuilds.parentDownloadId', $downloadId)
                            ->join('downloadFlavours', 'downloadFlavours.flavourId', '=', 'downloadsBuilds.flavourId')
                            ->select('downloadBuilds.*', 'downloadFlavours.title');

        //TODO: Convert to querybuilder... Couldn't get it to work so I wrote a manual query
        */
        $downloadsBuilds = DB::select('SELECT filePath, fileName, fileSize, fileHash, title as flavourName
                                        FROM downloadsBuilds b
                                        JOIN downloadFlavours f ON (f.flavourId = b.flavourId)
                                        WHERE parentDownloadId = :id', ['id' => $downloadId]);

        if ($request->wantsJson()) {
            //TODO: return nice json stuff
            return null;
        }
        return view('download.download', ['download' => $download,
                                            'downloadsBuilds' => $downloadsBuilds,
                                            'commits' => json_decode($download->commits, TRUE),
                                            'serverURL' => 'http://cdn.limetric.com/games/openrct2/']);
    }
}
