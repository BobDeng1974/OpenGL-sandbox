#pragma once

#include <string>
#include <stb_image.h>
#include <glad/glad.h>
#include <iostream>
#include <glm/glm.hpp>


class Texture
{
public:
	Texture();
	explicit Texture(const std::string& _file);
	Texture(Texture&& _move);
	~Texture();

	// Forbid copy
	Texture(const Texture& _copy) = delete;
	Texture& operator=(const Texture& _copy) = delete;

	void createColorPlaceholder(const glm::vec3& color = glm::vec3(1.f));
	bool loadFromFile(const std::string& _file);
	void bind() const;

protected:
	unsigned int m_textureId;

};
