import { Table, Avatar, Tag } from "antd";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { fetchAnime, filterAnime } from "../../services/anime-api";
import Filter from "./Filter";

const AnimeList = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    sort: "",
    type: "",
    status: "",
    order_by: "",
    page: 1,
    pageSize: 5,
  });
  const [types, setTypes] = useState([]);

  const getAnime = async () => {
    setLoading(true);
    try {
      const response = await fetchAnime();
      if (response.data) {
        setAnime(response);
        fetchTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = (animeList) => {
    const uniqueTypes = [
      ...new Set(animeList.map((anime) => anime.type).filter(Boolean)),
    ];
    const typeOptions = uniqueTypes.map((type) => ({
      label: type,
      value: type,
    }));
    setTypes(typeOptions);
  };

  const handleStatus = (status) => {
    const statusMap = {
      "Currently Airing": { key: "Airing", color: "red" },
      "Finished Airing": { key: "Complete", color: "green" },
      "Not yet aired": { key: "Upcoming", color: "orange" },
    };
    return statusMap[status] || { key: "Unknown", color: "#9ca3af" };
  };

  const handleFilterChange = useCallback(
    debounce(async (updatedFilter) => {
      setLoading(true);
      try {
        const response = await filterAnime(updatedFilter);
        setAnime(response);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    getAnime();
  }, []);

  useEffect(() => {
    handleFilterChange(filter);
  }, [filter]);

  const columns = [
    { title: "ID", dataIndex: "mal_id" },
    {
      title: "Title",
      dataIndex: "title",
      render: (title, record) => (
        <div className="flex gap-2 items-center">
          <Avatar src={record.images?.jpg?.small_image_url} alt="avatar" />
          {title}
        </div>
      ),
    },
    { title: "Rank", dataIndex: "rank", sorter: (a, b) => a.rank - b.rank },
    { title: "Type", dataIndex: "type" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const { key, color } = handleStatus(status);
        return <Tag color={color}>{key}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Filter
        setFilter={(key, value) =>
          setFilter((prev) => ({ ...prev, [key]: value }))
        }
        types={types}
      />
      <Table
        columns={columns}
        dataSource={anime.data}
        rowKey="mal_id"
        loading={loading}
        pagination={{
          pageSize: filter?.pageSize,
          pageSizeOptions: [5, 10, 20, 50],
          total: anime?.pagination?.items?.total,
          showSizeChanger: true,
          onChange: (page, pageSize) =>
            setFilter((prev) => ({ ...prev, page, pageSize: pageSize })),
        }}
      />
    </div>
  );
};

export default AnimeList;
