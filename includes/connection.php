<?php

session_start();
class backend
{
    private $server = "localhost";
    private $username = "root";
    private $psw = "";
    private $database = "digiscale";
    private $mysql;
    private $conn = false;
    private $result = [];
    private $connection;

    public function __construct()
    {
        if (!$this->conn) {
            $this->mysql = new mysqli($this->server, $this->username, $this->psw, $this->database);
            $this->conn = true;
            if ($this->mysql->connect_error) {
                echo "Error in connecting with database" . $this->mysql->connect_error;
            }
        } else {
            return true;
        }
    }

    function insertion($table, $param = array())
    {
        $columns = implode(", ", array_keys($param));
        $values = implode("', '", $param);

        $insertQuery = "INSERT INTO $table ($columns) VALUES ('$values')";
        $RunInsertQuery = $this->mysql->query($insertQuery);

        if ($RunInsertQuery) {
            // echo "Inserted Successfully";
            return $RunInsertQuery;
        } else {
            echo $this->mysql->connect_error;
        }

        $last_inserted_id = mysqli_insert_id($this->mysql);
        if ($last_inserted_id) {
            return $last_inserted_id;
        }
    }

    public function getLastInsertedId()
    {
        // Get the last inserted ID from the connection
        return mysqli_insert_id($this->mysql);
    }


    function fetching($table, $rows = "*", $join = null, $where = null, $joinType = "LEFT")
    {
        $select = "SELECT $rows FROM $table";
        if (!is_null($join)) {
            $select .= " $joinType JOIN $join";
        }
        if (!is_null($where)) {
            $select .= " WHERE $where";
        }
        $RunSelect = $this->mysql->query($select);

        if ($RunSelect) {
            $FetchData = $RunSelect->fetch_all(MYSQLI_ASSOC);
            if ($FetchData) {
                if ($FetchData !== null) {
                    return $FetchData;
                }
            }
        } else {
            echo "Error Occur in Query" . $this->mysql->error;
            return array();
        }
    }


    function update($table, $param = array(), $where = null, $limit = null)
    {

        $data = array();
        foreach ($param as $col => $val) {
            $data[] =  "$col = '$val'";
        }

        $upData =  implode(',', $data);
        $update = "UPDATE `$table` SET $upData";

        if (!is_null($where)) {
            $update .= " WHERE $where";
        }
        if (!is_null($limit)) {
            $update .= " LIMIT $limit";
        }
        $updateRun = $this->mysql->query($update);
        if ($updateRun) {
            return $updateRun;
        } else {
            // echo "Not Updated" . $this->mysql->connect_error;
            return false;
        }
    }

    function deletion($table, $where = null)
    {
        $deldata = "DELETE FROM $table ";

        if (!is_null($where)) {
            $deldata .= "WHERE $where";
        }

        $deldataRun = $this->mysql->query($deldata);

        if ($deldataRun) {
            return true; // or return $deldataRun; if you need the result for something
        } else {
            // Instead of echoing, return false or an error message
            return "Error deleting record: " . $this->mysql->error;
        }
    }

} // class end here

function imagehandling($img)
{
    $img_name = $img['name'];
    $img_tmp = $img['tmp_name'];
    $uploads = "../assets/userUploads/";
    $imgPath = $uploads . $img_name;
    move_uploaded_file($img_tmp, $imgPath);
    return array(
        'img_tmp' => $img_tmp,
        'imgPath' => $imgPath,
        'img_name' => $img_name
    );
}
