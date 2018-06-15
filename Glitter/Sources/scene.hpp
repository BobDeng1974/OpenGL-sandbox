#pragma once
#include "shader.hpp"
#include "sceneobject.hpp"
#include <json.hpp>
#include <string>
#include <vector>
#include <memory>


class Scene
{
public:
	bool loadFromFile(const std::string& _path);
	bool saveToFile(const std::string& _path) const;

	std::shared_ptr<SceneObject> addObject(const std::string& _modelPath);

	void draw(const Shader& _shader) const;
	void configObjects();

	size_t size() const;
	SceneObject& operator[](size_t _i);
	const SceneObject& operator[](size_t _i) const;

protected:
	static glm::vec3 loadVector(const nlohmann::json& _obj, const std::string& _vectName);

protected:
	std::vector<std::shared_ptr<SceneObject>> m_objects;
	int m_currentObject = 0;

};
