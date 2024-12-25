import { Card, Input, Select, Tabs } from "antd";

const Filter = ({ setFilter, types }) => {
  const handleTabChange = (key) => {
    const statusMap = {
      "1": "",
      "2": "airing",
      "3": "complete",
      "4": "upcoming",
    };
    setFilter("status", statusMap[key]);
  };

  return (
    <Card className="shadow-md">
      <div className="flex flex-col gap-3">
        <Tabs
          defaultActiveKey="1"
          onChange={handleTabChange}
          items={[
            { key: "1", label: "All" },
            { key: "2", label: "Airing" },
            { key: "3", label: "Complete" },
            { key: "4", label: "Upcoming" },
          ]}
        />
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-full">
            <label>Type</label>
            <Select
              placeholder="Select type"
              options={types}
              onChange={(value) => setFilter("type", value)}
              allowClear
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label>Title</label>
            <Input
              placeholder="Search..."
              onChange={(e) => setFilter("title", e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Filter;
