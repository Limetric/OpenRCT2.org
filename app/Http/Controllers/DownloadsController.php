<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class DownloadsController extends Controller
{
    private $serverURL = 'http://cdn.limetric.com/games/openrct2/';
    /**
     * Displays the main downloads page
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $downloads = DB::table('downloads')
                            ->join('downloadsBuilds', function($join) {
                                $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId');
                            })
                            ->select('downloads.*', 'downloadsBuilds.status')
                            ->groupBy('downloadId')
                            ->orderBy('downloadId', 'desc')
                            ->take(25)
                            ->get();
        
        //Generate gitHashShort and check if latest
        $hadBranches = array();
        foreach ($downloads as $key => $download) {
            if (!isset($download->gitHashShort) || empty($download->gitHashShort))
                $download->gitHashShort = substr($download->gitHash, 0, 7);

            if (!in_array($download->gitBranch, $hadBranches)) {
                $download->latestInBranch = true;
                $hadBranches[] = $download->gitBranch;
            } else
                $download->latestInBranch = false;
        }

        $stable = DB::table('downloads')
                            ->where('gitBranch', 'master')
                            ->orderBy('downloadId', 'desc')
                            ->first();

        //Get flavours
        /*$flavours = DB::table('downloadFlavours')
                            ->leftJoin('downloadsBuilds', function($join) {
                                    $join->on('downloadsBuilds.flavourId', '=', 'downloadFlavours.flavourId');
                            })
                            ->select('downloadFlavours.*', 'downloadsBuilds.fileName', 'downloadsBuilds.parentDownloadId')
                            ->orderBy('downloadFlavours.flavourId', 'asc')
                            ->orderBy('downloadsBuilds.parentDownloadId', 'desc')
                            ->groupBy('downloadBuilds.parentDownloadId')
                            ->where('downloadFlavours.visibility', 1)
                            ->get();*/

        $flavours = DB::table('downloadFlavours')
                            ->select('downloadFlavours.*')
                            ->where('downloadFlavours.visibility', 1)
                            ->where('downloadFlavours.indexVisibility', 1)
                            ->get();

        foreach ($flavours as $flavour) {
            $build = DB::table('downloadsBuilds')
                            ->select('downloadsBuilds.*', 'downloads.version', 'downloads.gitBranch', 'downloads.gitHashShort', 'downloads.addedTime')
                            ->leftJoin('downloads', function($join) {
                                    $join->on('downloads.downloadId', '=', 'downloadsBuilds.parentDownloadId');
                            })
                            ->where('status', 'success')
                            ->where('downloads.gitBranch', 'develop')
                            ->where('downloadsBuilds.flavourId', $flavour->flavourId)
                            ->orderBy('buildId', 'desc')
                            ->first();

            $flavour->latestDownload = $build;
        }

        return view('download.index', ['downloads' => $downloads, 'stable' => $stable, 'flavours' => $flavours, 'serverURL' => $this->serverURL]);
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

        if (!$download)
            return redirect()->action('DownloadsController@index');

        if (!isset($download->gitHashShort))
            $download->gitHashShort = substr($download->gitHash, 0, 7);


        //TODO: Convert to querybuilder... Couldn't get it to work so I wrote a manual query
        $downloadsBuilds = DB::select('SELECT b.filePath, b.fileName, b.fileSize, b.fileHash, f.platform AS flavourPlatform, f.architecture AS flavourArchitecture, f.name as flavourName
                                        FROM downloadsBuilds b
                                        JOIN downloadFlavours f ON (f.flavourId = b.flavourId)
                                        WHERE parentDownloadId = :id', ['id' => $download->downloadId]);

        return view('download.download', ['download' => $download,
                                            'downloadsBuilds' => $downloadsBuilds,
                                            'commits' => json_decode($download->commits, TRUE),
                                            'serverURL' => $this->serverURL]);
    }

    /**
     * Displays the download page, or returns json of a specific downloadId.
     *
     * @param  String $identifier
     * @return \Illuminate\Http\Response
     */
    public function showLatest(String $identifier = null)
    {
        //Check if identifier matches one of the flavours
        $flavour = DB::table('downloadFlavours')
                            ->select('flavourId', 'identifier')
                            ->where('identifier', $identifier)
                            ->first();

        if (isset($flavour)) {
            $download = DB::table('downloads')
                                ->join('downloadsBuilds', function ($join) {
                                    $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId');
                                })
                                ->select('downloads.*', 'downloadsBuilds.status', 'downloadsBuilds.flavourId')
                                ->orderBy('downloadId', 'desc')
                                ->where('downloadsBuilds.flavourId', $flavour->flavourId)
                                ->first();
        } else {    
            //Check for branch
            $download = DB::table('downloads')
                                ->join('downloadsBuilds', function ($join) {
                                    $join->on('downloadsBuilds.parentDownloadId', '=', 'downloads.downloadId');
                                })
                                ->select('downloads.*', 'downloadsBuilds.status')
                                ->orderBy('downloadId', 'desc')
                                ->where('gitBranch', $identifier)
                                ->orwhere('version', $identifier)
                                ->first();
        }

        if (!$download)
            return redirect()->action('DownloadsController@index');

        if (!isset($download->gitHashShort))
            $download->gitHashShort = substr($download->gitHash, 0, 7);


        //TODO: Convert to querybuilder... Couldn't get it to work so I wrote a manual query
        $downloadsBuilds = DB::select('SELECT b.filePath, b.fileName, b.fileSize, b.fileHash, f.platform AS flavourPlatform, f.architecture AS flavourArchitecture, f.name as flavourName
                                        FROM downloadsBuilds b
                                        JOIN downloadFlavours f ON (f.flavourId = b.flavourId)
                                        WHERE parentDownloadId = :id', ['id' => $download->downloadId]);

        return view('download.download', ['latest' => $identifier,
                                            'download' => $download,
                                            'downloadsBuilds' => $downloadsBuilds,
                                            'commits' => json_decode($download->commits, TRUE),
                                            'serverURL' => $this->serverURL]);
    }
}
