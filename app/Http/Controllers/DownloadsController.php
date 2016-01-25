<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class DownloadsController extends Controller
{
    /**
     * Displays the main downloads page
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $downloads = DB::table('downloads')
                            ->join('downloadsBuilds', function ($join) {
                                $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId');
                            })
                            ->select('downloads.*', 'downloadsBuilds.status')
                            ->groupBy('downloadId')
                            ->orderBy('downloadId', 'desc')
                            ->take(25)
                            ->get();
        //Generate gitHashShort
        foreach ($downloads as $key => $download) {
            if (!isset($download->gitHashShort) || empty($download->gitHashShort))
                $download->gitHashShort = substr($download->gitHash, 0, 7);
        }

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

        return view('download.index', ['downloads' => $downloads, 'latest' => $latest]);
    }

    /**
     * Displays the download page of a specific downloadId.
     *
     * @param  String  $gitBranch
     * @param  String  $gitHash
     * @return \Illuminate\Http\Response
     */
    public function show(String $gitBranch, String $gitHash)
    {
        $download = DB::table('downloads')
                            ->join('downloadsBuilds', function ($join) {
                                $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId');
                            })
                            ->select('downloads.*', 'downloadsBuilds.status')
                            ->where('gitBranch', $gitBranch)
                            ->where('gitHash', 'like', $gitHash .'%')
                            ->orderBy('downloadId', 'desc')
                            ->first();

        $download->gitHashShort = substr($download->gitHash, 0, 7);

        /* $downloadsBuilds = DB::table('downloadsBuilds')
                            ->where('downloadsBuilds.parentDownloadId', $downloadId)
                            ->join('downloadFlavours', 'downloadFlavours.flavourId', '=', 'downloadsBuilds.flavourId')
                            ->select('downloadBuilds.*', 'downloadFlavours.title');

        //TODO: Convert to querybuilder... Couldn't get it to work so I wrote a manual query
        */
        $downloadsBuilds = DB::select('SELECT b.filePath, b.fileName, b.fileSize, b.fileHash, f.platform AS flavourPlatform, f.architecture AS flavourArchitecture, f.name as flavourName
                                        FROM downloadsBuilds b
                                        JOIN downloadFlavours f ON (f.flavourId = b.flavourId)
                                        WHERE parentDownloadId = :id', ['id' => $download->downloadId]);

        return view('download.download', ['download' => $download,
                                            'downloadsBuilds' => $downloadsBuilds,
                                            'commits' => json_decode($download->commits, TRUE),
                                            'serverURL' => 'http://cdn.limetric.com/games/openrct2/']);
    }

    /**
     * Displays the download page, or returns json of a specific downloadId.
     *
     * @param  String $identifier
     * @return \Illuminate\Http\Response
     */
    public function showLatest(String $identifier = null)
    {
        if ($identifier == null || $identifier == 'develop') {
            $download = DB::table('downloads')
                                ->orderBy('downloadId', 'desc')
                                ->first();
            if ($download == null)
                return redirect()->action('DownloadsController@index');
            return redirect()->action('DownloadsController@show', [$download->gitBranch, substr($download->gitHash, 0, 7)]);
        } elseif ($identifier == 'master' || $identifier == 'stable') {
            $download = DB::table('downloads')
                                ->where('gitBranch', 'master')
                                ->orderBy('downloadId', 'desc')
                                ->first();
            if ($download == null)
                return redirect()->action('DownloadsController@index');
            return redirect()->action('DownloadsController@show', [$download->gitBranch, substr($download->gitHash, 0, 7)]);
        } else {
            $download = DB::table('downloads')
                                ->where('version', $identifier)
                                ->orderBy('downloadId', 'desc')
                                ->first();
            if ($download == null) return
                redirect()->action('DownloadsController@index');
            return redirect()->action('DownloadsController@show', [$download->gitBranch, substr($download->gitHash, 0, 7)]);
        }
    }
}
